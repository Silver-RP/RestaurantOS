import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getBotReply = async (userMessage: string): Promise<string> => {
  try {
    const context = `
Bạn là trợ lý lễ tân của Nhà Hàng Beef Beef, chuyên hỗ trợ khách đặt bàn và giải đáp thắc mắc.

Thông tin nhà hàng:
- Tên: Beef Beef Restaurant
- Địa chỉ: 161 đường Quốc Hương, Thảo Điền, Quận 2, TP.HCM
- Đặt bàn: +39-055-123456
- Bữa trưa: Thứ 2 - Chủ Nhật, từ 10:30 - 15:00
- Bữa tối 1: Thứ 2 - Chủ Nhật, từ 17:30 - 23:00
- Quy định: Không mang thức ăn bên ngoài. Có bãi đỗ xe. Phục vụ cả món chay và thịt nướng. Phí dịch vụ 10%.

Nguyên tắc trả lời:
- Luôn lịch sự, ngắn gọn, thân thiện.
- Nếu không biết thông tin, hãy trả lời: "Xin lỗi, tôi không rõ thông tin này, bạn có thể gọi số đặt bàn để được hỗ trợ thêm."
- Nếu khách hỏi về giờ mở cửa, hãy gợi ý đặt bàn.
- Nếu khách hỏi về địa chỉ, hãy cung cấp địa chỉ rõ ràng.
`.trim();

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        max_tokens: 512,
        messages: [
          {
            role: 'system',
            content: context,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('❌ Bot error:', error.response?.data || error.message);
    return 'Xin lỗi, tôi không thể phản hồi lúc này.';
  }
};
