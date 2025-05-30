import { Request, Response } from 'express';
import { verifyReturn } from '../utils/vnpay';
import { flattenQueryParams } from '../utils/queryHelpers';
import OrderService from '../services/OrderService';

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || 'http://localhost:5173';

export const vnpayReturn = async (req: Request, res: Response): Promise<any> => {
    try {

        const vnp_Params = flattenQueryParams(req.query);
        const isValid = verifyReturn(vnp_Params);

        if (!isValid) {
            return res.status(400).send('Checksum failed - Invalid response from VNPay');
        }

        const vnp_ResponseCode = vnp_Params.vnp_ResponseCode;
        const orderId = vnp_Params.vnp_TxnRef;
        const amount = Number(vnp_Params.vnp_Amount) / 100;

        if (vnp_ResponseCode === '00') {
            await OrderService.markOrderPaid(orderId, amount);
            return res.redirect(`${CLIENT_BASE_URL}/order-success`);
        } else {
            await OrderService.markOrderFailed(orderId);
            return res.redirect(`${CLIENT_BASE_URL}/order-failed`);
        }
    } catch (error) {
        console.error('VNPay return error:', error);
        return res.status(500).send('Internal Server Error');
    }
};
