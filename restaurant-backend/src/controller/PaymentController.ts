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


// export const momoIPNHandler = async (req: Request, res: Response) => {
//     try {
//         const { orderId, amount, signature, ...rest } = req.body;

//         const rawData = `accessKey=${process.env.MOMO_ACCESS_KEY}& amount=${amount}`;
//       const expectedSignature = crypto.createHmac('sha256', process.env.MOMO_SECRET_KEY)
//                                .update(rawData)
//                                .digest('hex');
  
//       if (signature !== expectedSignature) {
//         return res.status(400).send('Invalid signature');
//       }
  
//       if (rest.resultCode === 0) {
//         await OrderService.markOrderPaid(orderId, Number(amount));
//       } else {
//         await OrderService.markOrderFailed(orderId);
//       }
  
//       return res.status(200).send({ message: 'IPN received' });
//     } catch (err) {
//       console.error('MoMo IPN error:', err);
//       return res.status(500).send('Internal Server Error');
//     }
//   };
  
  