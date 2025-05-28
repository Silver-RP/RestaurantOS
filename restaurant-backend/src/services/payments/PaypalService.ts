import { paypalClient } from '../../config/paypal';
import paypal from '@paypal/checkout-server-sdk';
import { IOrder } from '../../models/OrderModel';
import { IOrderDetail } from '../../models/OrderDetailModel';

interface IOrderWithItems extends IOrder {
  order_items: IOrderDetail[];
}

function convertVNDToUSD(vnd: number): number {
  const usdExchangeRate = 26000;
  return +(vnd / usdExchangeRate).toFixed(2);
}

export async function createPayPalOrder(order: IOrderWithItems): Promise<string> {
  if (!order.order_items || !Array.isArray(order.order_items)) {
    throw new Error('Order items (order_items) are missing or invalid');
  }

  const usdTotal = convertVNDToUSD(order.total_price || 0);
  const usdItemsPrice = convertVNDToUSD(order.items_price);
  const usdShipping = convertVNDToUSD(order.shipping_fee);
  const usdTax = convertVNDToUSD(order.vat_amount);

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: order._id.toString(),
      amount: {
        currency_code: 'USD',
        value: usdTotal.toFixed(2),
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: usdItemsPrice.toFixed(2),
          },
          shipping: {
            currency_code: 'USD',
            value: usdShipping.toFixed(2),
          },
          tax_total: {
            currency_code: 'USD',
            value: usdTax.toFixed(2),
          },
          discount: {
            currency_code: 'USD',
            value: '0.00',
          },
          handling: {
            currency_code: 'USD',
            value: '0.00',
          },
          insurance: {
            currency_code: 'USD',
            value: '0.00',
          },
          shipping_discount: {
            currency_code: 'USD',
            value: '0.00',
          }
        }
      },
      items: order.order_items.map((item) => ({
        name: item.dish_name,
        unit_amount: {
          currency_code: 'USD',
          value: convertVNDToUSD(item.unit_price).toFixed(2),
        },
        quantity: item.quantity.toString(),
        category: 'PHYSICAL_GOODS',
      }))
    }],
    application_context: {
      return_url: `${process.env.SERVER_BASE_URL}/api/payment/paypal-return`,
      cancel_url: `${process.env.CLIENT_BASE_URL}/payment-cancel`,
    }
  });

  try {
    const response = await paypalClient.execute(request);
    const approvalUrl = response.result.links?.find((link: { rel: string; }) => link.rel === 'approve')?.href;
    if (!approvalUrl) {
      throw new Error('Approval URL not found in PayPal response');
    }
    return approvalUrl;
  } catch (error) {
    console.error('PayPal create order error:', error);
    throw error;
  }
}


export async function capturePayPalOrder(paypalOrderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({
            payment_source: null as any 
    });

    try {
        const response = await paypalClient.execute(request);
        return response.result;
    } catch (error) {
        console.error('Error capturing PayPal order:', error);
        throw error;
    }
}

