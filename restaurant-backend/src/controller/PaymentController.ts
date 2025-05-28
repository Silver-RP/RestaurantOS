import { Request, Response } from 'express';
import { verifyReturn } from '../utils/vnpay';
import { flattenQueryParams } from '../utils/queryHelpers';
import OrderService from '../services/OrderService';
import { capturePayPalOrder } from '../services/payments/PaypalService';


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
            return res.redirect(`${CLIENT_BASE_URL}/payment-success`);
        } else {
            await OrderService.markOrderFailed(orderId);
            return res.redirect(`${CLIENT_BASE_URL}/payment-failed`);
        }
    } catch (error) {
        console.error('VNPay return error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export const momoReturn = async (req: Request, res: Response): Promise<any> => {
    try {
        const { orderId, amount, resultCode } = req.query;

        if (!orderId || !amount || typeof resultCode === 'undefined') {
            return res.status(400).send('Thiếu tham số từ MoMo');
        }

        if (resultCode !== '0') {
            await OrderService.markOrderFailed(orderId as string);
            return res.redirect(`${CLIENT_BASE_URL}/payment-failed`);
        }

        await OrderService.markOrderPaid(orderId as string, Number(amount));
        return res.redirect(`${CLIENT_BASE_URL}/payment-success`);
    } catch (error) {
        console.error('MoMo return error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export const paypalReturn = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send('Missing token');
        }

        const captureResult = await capturePayPalOrder(token as string);
        console.log('PayPal capture result:', captureResult);

        if (captureResult.status === 'COMPLETED') {
            const referenceId = captureResult.purchase_units?.[0]?.reference_id;
            const amountUSD = parseFloat(captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || '0');

            if (!referenceId || isNaN(amountUSD)) {
                return res.status(400).send('Missing reference ID or amount from PayPal');
            }

            const amountVND = convertUSDtoVND(amountUSD);
            console.log('Marking order as paid:', referenceId, amountUSD, 'USD =>', amountVND, 'VND');

            await OrderService.markOrderPaid(referenceId, amountVND);

            return res.redirect(`${CLIENT_BASE_URL}/payment-success`);
        } else {
            const referenceId = captureResult.purchase_units?.[0]?.reference_id;
            if (referenceId) {
                await OrderService.markOrderFailed(referenceId);
            }
            return res.redirect(`${CLIENT_BASE_URL}/payment-failed`);
        }
    } catch (error) {
        console.error('PayPal return error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

function convertUSDtoVND(usdAmount: number): number {
    const exchangeRate = 26000;
    return Math.round(usdAmount * exchangeRate);
}

