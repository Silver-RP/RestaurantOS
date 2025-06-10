import transporter from '../config/mailer';
import { IOrder } from '../models/OrderModel';
import { IUser } from '../models/UserModel';
import { IAddress } from '../models/AddressModel';
import { IOrderDetail } from '../models/OrderDetailModel';
import { IPayment } from '../models/PaymentModel';

type MailTemplateParams = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
};

const MailerService = {
  async sendTemplateEmail({ to, subject, template, context }: MailTemplateParams) {
    console.log('📧 [MailerService] Starting to send template email');
    console.log('📝 [MailerService] Template name:', template);
    console.log('🔍 [MailerService] Template context:', JSON.stringify(context, null, 2));
    console.log('📨 [MailerService] Email to:', to);
    console.log('📌 [MailerService] Email subject:', subject);

    try {
      await transporter.sendMail({
        from: `"BeefBeef Restaurant" <${process.env.MAIL_USERNAME}>`,
        to,
        subject,
        template,
        context,
      } as any);
      console.log('✅ [MailerService] Email sent successfully');
    } catch (error) {
      console.error('❌ [MailerService] Error sending email:', error);
      throw error;
    }
  },

  async sendOrderConfirmation(
    order: IOrder & { user: IUser; receiverInfo?: IAddress; items: IOrderDetail[] },
  ) {
    const isPickup = order.delivery_type === 'PICKUP';

    const name = isPickup ? order.receiver : order.receiverInfo?.full_name || '';
    const phone = isPickup ? order.receiver_phone : order.receiverInfo?.phone || '';
    const address = isPickup
      ? 'Nhận tại nhà hàng<br><span style="font-weight: 600;">Nhà Hàng BeefBeef</span><br>161 đường Quốc Hương, Thảo Điền, Quận 2,<br>TP. Hồ Chí Minh'
      : `${order.receiverInfo?.street_address}, ${order.receiverInfo?.ward}, ${order.receiverInfo?.district}, ${order.receiverInfo?.province}`;

    await this.sendTemplateEmail({
      to: order.user.email,
      subject: `Xác nhận đơn hàng #${order._id.toString().slice(-6).toUpperCase()}`,
      template: 'order-confirmation',
      context: {
        orderId: order._id.toString().slice(-6).toUpperCase(),
        name,
        phone,
        address,
        items: order.items.map((item) => ({
          name: item.dish_name,
          quantity: item.quantity,
          unitPrice: item.unit_price.toLocaleString('vi-VN') + '₫',
          totalPrice: item.total_amount.toLocaleString('vi-VN') + '₫',
        })),
        deliveryMethod: this.getDeliveryTypeName(order.delivery_type),
        paymentMethod: this.getPaymentMethodName(order.payment_method),
        note: order.note || 'Không có',
        deliveryTime: this.getFormattedDeliveryTime(order),
        subtotal: order.items_price.toLocaleString('vi-VN') + '₫',
        vat: order.vat_amount.toLocaleString('vi-VN') + '₫',
        shippingFee: order.shipping_fee.toLocaleString('vi-VN') + '₫',
        total:
          (
            order.total_price ?? order.items_price + order.vat_amount + order.shipping_fee
          ).toLocaleString('vi-VN') + '₫',
        orderDetailUrl: `${process.env.CLIENT_BASE_URL || '#'}/profile/orders?orderId=${order._id}`,
      },
    });
  },

  async sendOrderPaymentSuccess(params: { payment: IPayment; order: IOrder; userEmail: string }) {
    const { payment, order, userEmail } = params;

    await this.sendTemplateEmail({
      to: userEmail,
      subject: `Thanh toán thành công cho đơn hàng #${order._id.toString().slice(-6).toUpperCase()}`,
      template: 'payment-success',
      context: {
        orderId: order._id.toString().slice(-6).toUpperCase(),
        transactionCode: payment.transaction_code?.toString().toUpperCase(),
        paymentMethod: this.getPaymentMethodName(payment.payment_method).toString().toUpperCase(),
        amount: payment.amount.toLocaleString('vi-VN') + '₫',
        date: new Date(payment.created_at).toLocaleString('vi-VN', {
          weekday: 'long',
          day: 'numeric',
          month: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        invoiceUrl: `${process.env.CLIENT_BASE_URL || '#'}/profile/orders?orderId=${order._id}`,
      },
    });
  },

  async sendReservationConfirmation(reservation: {
    _id: string;
    user: IUser;
    full_name: string;
    phone: string;
    email: string;
    time: string;
    date: string;
    seating_type: string;
    table_count: number;
    note?: string;
    items?: {
      name: string;
      quantity: number;
      price: number;
    }[];
  }) {
    console.log('📋 [MailerService] Preparing reservation confirmation email');
    const {
      _id,
      user,
      full_name,
      phone,
      email,
      time,
      date,
      seating_type,
      table_count,
      note,
      items,
    } = reservation;

    console.log('⏰ [MailerService] Original time value:', time);
    console.log('📅 [MailerService] Original date value:', date);

    const orderIdShort = _id.toString().slice(-6).toUpperCase();
    console.log('🆔 [MailerService] Reservation ID:', orderIdShort);

    const emailContext = {
      name: full_name,
      phone,
      email,
      time: time, // Giữ nguyên giá trị time gốc
      date: new Date(date).toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }),
      seatingType: seating_type,
      tableCount: table_count,
      note: note || 'Không có ghi chú',
      items:
        items?.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price.toLocaleString('vi-VN') + '₫',
        })) || [],
      reservationDetailUrl: `${process.env.CLIENT_BASE_URL || '#'}/profile/reservations?reservationId=${_id}`,
    };

    console.log(
      '📨 [MailerService] Prepared email context:',
      JSON.stringify(emailContext, null, 2),
    );

    await this.sendTemplateEmail({
      to: user.email,
      subject: `Xác nhận đặt bàn #${orderIdShort}`,
      template: 'reservation-confirmation',
      context: emailContext,
    });
  },

  getPaymentMethodName(method: string): string {
    switch (method) {
      case 'CASH':
        return 'Tiền mặt';
      case 'BANKING':
        return 'Chuyển khoản ngân hàng';
      case 'VNPAY':
        return 'VNPay';
      case 'MOMO':
        return 'MoMo';
      case 'MOMO_ATM':
        return 'MoMo ATM';
      case 'CREDIT_CARD':
        return 'Thẻ tín dụng';
      default:
        return 'Không xác định';
    }
  },

  getDeliveryTypeName(type: string): string {
    switch (type) {
      case 'DELIVERY':
        return 'Giao tận nơi';
      case 'PICKUP':
        return 'Tự đến lấy';
      default:
        return 'Không xác định';
    }
  },

  getFormattedDeliveryTime(order: IOrder): string {
    if (order.delivery_time_type === 'ASAP' && !order.scheduled_time) {
      const created = new Date(order.createdAt ? order.createdAt : Date.now());

      const min = new Date(created.getTime() + 45 * 60000);
      const max = new Date(created.getTime() + 90 * 60000);

      const roundTime = (date: Date, direction: 'up' | 'down') => {
        const d = new Date(date);
        const minutes = d.getMinutes();
        const roundedMinutes =
          direction === 'up' ? Math.ceil(minutes / 5) * 5 : Math.floor(minutes / 5) * 5;
        if (roundedMinutes === 60) {
          d.setHours(d.getHours() + 1);
          d.setMinutes(0);
        } else {
          d.setMinutes(roundedMinutes);
        }
        d.setSeconds(0);
        return d;
      };

      const minRounded = roundTime(min, 'down');
      const maxRounded = roundTime(max, 'up');

      const minStr = minRounded.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const maxStr = maxRounded.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `Dự kiến khoảng ${minStr} – ${maxStr} (tính từ lúc đặt hàng)`;
    }

    if (order.delivery_time_type === 'SCHEDULED' && order.scheduled_time) {
      return `Giao vào ${order.scheduled_time.toLocaleString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }

    return 'Chưa xác định thời gian giao hàng';
  },
};

export default MailerService;
