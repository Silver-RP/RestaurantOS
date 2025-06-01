import { IOrder } from '../../models/OrderModel';
import { dateFormat, VnpLocale } from 'vnpay';
import vnpay from '../../config/vnpay';

const expireDate = new Date();
expireDate.setDate(expireDate.getDate() + 1);
const VNP_RETURN_URL = process.env.VNP_RETURN_URL || 'http://localhost:4000/api/payment/vnpay-return';

export const createVNPayPaymentUrl = (order: IOrder, clientIp: string, paymentId: string) => {
    return vnpay.buildPaymentUrl({
        vnp_Amount: (order.total_price || 0), 
        vnp_IpAddr: clientIp || '127.0.0.1',
        vnp_TxnRef: paymentId,
        vnp_OrderInfo: `Thanh toán đơn hàng #${order._id.toString()}`,
        vnp_ReturnUrl: VNP_RETURN_URL,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(expireDate),
    });
};
