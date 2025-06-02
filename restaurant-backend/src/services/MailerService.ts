import transporter from '../config/mailer';
import { IOrder } from '../models/OrderModel';
import { IUser } from '../models/UserModel';
import { IAddress } from '../models/AddressModel';
import { IOrderDetail }  from '../models/OrderDetailModel';

type MailTemplateParams = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
};

const MailerService = {
    
  async sendTemplateEmail({ to, subject, template, context }: MailTemplateParams) {
    await transporter.sendMail({
        from: `"BeefBeef Restaurant" <${process.env.MAIL_USERNAME}>`,
        to,
        subject,
        template,
        context,
      } as any);
  },

  async sendOrderConfirmation(order: IOrder & { user: IUser; receiverInfo: IAddress; items: IOrderDetail[] }) {
    const receiver = order.receiverInfo;
  
    await this.sendTemplateEmail({
      to: order.user.email,  // Email người đặt hàng
      subject: `Xác nhận đơn hàng #${order._id.toString().slice(-6).toUpperCase()}`,  
      template: 'order-confirmation',
      context: {
        orderId: order._id.toString().slice(-6).toUpperCase(),
        name: receiver.full_name,
        phone: receiver.phone,
        address: `${receiver.street_address}, ${receiver.ward}, ${receiver.district}, ${receiver.province}`,
        
        items: order.items.map(item => ({
          name: item.dish_name,
          quantity: item.quantity,
          unitPrice: item.unit_price.toLocaleString('vi-VN') + '₫',
          totalPrice: item.total_amount.toLocaleString('vi-VN') + '₫',
        })),
  
        deliveryMethod: this.getDeliveryTypeName(order.delivery_type),
        paymentMethod: this.getPaymentMethodName(order.payment_method),
        note: order.note || 'Không có',
        deliveryTime: order.delivery_time_type === 'SCHEDULED' 
          ? order.scheduled_time?.toLocaleString('vi-VN') 
          : 'Giao ngay',
        
        subtotal: order.items_price.toLocaleString('vi-VN') + '₫',
        vat: order.vat_amount.toLocaleString('vi-VN') + '₫',
        shippingFee: order.shipping_fee.toLocaleString('vi-VN') + '₫',
        total: (order.total_price ?? (order.items_price + order.vat_amount + order.shipping_fee)).toLocaleString('vi-VN') + '₫',
        
        orderDetailUrl: `${process.env.CLIENT_BASE_URL || '#'}/profile/orders/${order._id}`,
      }
    });
  },
  
  getPaymentMethodName(method: string): string {
    switch (method) {
      case 'CASH': return 'Tiền mặt';
      case 'BANKING': return 'Chuyển khoản ngân hàng';
      case 'VNPAY': return 'VNPay';
      case 'MOMO': return 'MoMo';
      case 'MOMO_ATM': return 'MoMo ATM';
      case 'CREDIT_CARD': return 'Thẻ tín dụng';
      default: return 'Không xác định';
    }
  },
  
  getDeliveryTypeName(type: string): string {
    switch (type) {
      case 'DELIVERY': return 'Giao tận nơi';
      case 'PICKUP': return 'Tự đến lấy';
      default: return 'Không xác định';
    }
  }
  
  
  


};

export default MailerService;
