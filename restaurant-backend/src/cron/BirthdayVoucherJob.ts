import cron from 'node-cron';
import UserModel from '../models/UserModel';
import VoucherModel from '../models/VoucherModel';
import UserVoucherModel from '../models/UserVoucherModel';
import MailerService from '../services/MailerService';

// Hàm tặng voucher sinh nhật và gửi email
export const runBirthdayVoucherJob = async () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Tìm user có ngày sinh nhật hôm nay
  const users = await UserModel.find({
    birthday: { $exists: true },
    $expr: {
      $and: [
        { $eq: [{ $dayOfMonth: "$birthday" }, day] },
        { $eq: [{ $month: "$birthday" }, month] }
      ]
    }
  });

  // Lấy voucher sinh nhật mới nhất, đang hoạt động
  const birthdayVoucher = await VoucherModel.findOne({ type: 'birthday', status: 'active' }).sort({ createdAt: -1 });

  if (!birthdayVoucher) return;

  for (const user of users) {
    // Kiểm tra user đã nhận voucher sinh nhật hôm nay chưa
    const existed = await UserVoucherModel.findOne({
      user_id: user._id,
      voucher_id: birthdayVoucher._id,
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      }
    });
    if (existed) continue;

    // Gán voucher cho user
    await UserVoucherModel.create({
      user_id: user._id,
      voucher_id: birthdayVoucher._id,
      status: 'saved'
    });

    // Gửi email thông báo
    await MailerService.sendVoucherNotification({
      userEmail: user.email,
      voucher: birthdayVoucher,
    });
  }
};

// Lên lịch chạy vào 8h sáng mỗi ngày
export const scheduleBirthdayVoucherJob = () => {
  cron.schedule('0 8 * * *', async () => {
    await runBirthdayVoucherJob();
    console.log('Đã chạy cron-job tặng voucher sinh nhật lúc 8h sáng');
  });
};