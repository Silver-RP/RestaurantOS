import crypto from 'crypto';
import axios from 'axios';
import { IOrder } from '../../models/OrderModel';
import { momoConfig } from '../../config/momo';

export const createMomoPaymentUrl = async (
    order: IOrder,
    method: 'wallet' | 'atm' = 'wallet',
    transactionId: string,
) => {
    const requestId = `${Date.now()}`;
    const orderId = transactionId;
    const amount = order.total_price;

    const requestType = method === 'atm' ? 'payWithATM' : 'captureWallet';
    const orderType = method === 'atm' ? 'atm' : 'momo_wallet';

    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=Thanh toán đơn hàng ${orderId}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
        .createHmac('sha256', momoConfig.secretKey)
        .update(rawSignature)
        .digest('hex');

    const body = {
        partnerCode: momoConfig.partnerCode,
        accessKey: momoConfig.accessKey,
        requestId,
        amount: amount ? amount.toString() : '0',
        orderId,
        orderInfo: `Thanh toán đơn hàng ${orderId}`,
        redirectUrl: momoConfig.redirectUrl,
        ipnUrl: momoConfig.ipnUrl,
        requestType,
        orderType,
        extraData: '',
        lang: 'vi',
        signature,
    };

    const response = await axios.post(momoConfig.endpoint, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log('Momo payment response:', response.data);

    return response.data.payUrl;
};



