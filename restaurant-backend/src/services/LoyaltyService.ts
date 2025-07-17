import LoyaltyAccount from '../models/LoyaltyAccountModel';
import LoyaltyTransaction from '../models/LoyaltyTransactionModel';
import LoyaltyTier from '../models/LoyaltyTierModel';
import { Types } from 'mongoose';

const POINTS_PER_AMOUNT = 100000; // 1 điểm cho mỗi 100.000đ

const LoyaltyService = {
  // Lấy điểm, tổng chi tiêu, tier hiện tại
  async getAccountInfo(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const account = await LoyaltyAccount.findOne({ user_id: userObjectId }).populate('current_tier');
    if (!account) return { total_points: 0, total_spent: 0, current_tier: null };
    const accountObj = account.toObject();
    return {
      ...accountObj,
      current_tier: accountObj.current_tier, // đã populate
    };
  },

  // Lấy lịch sử cộng/trừ điểm
  async getTransactionHistory(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const account = await LoyaltyAccount.findOne({ user_id: userObjectId });
    if (!account) return [];
    return LoyaltyTransaction.find({ account_id: account._id }).sort({ created_at: -1 });
  },

  // Lấy tất cả các tier
  async getAllTiers() {
    return LoyaltyTier.find().sort({ min_spent: 1 });
  },

  // Hàm tính lại tier dựa trên chi tiêu năm hiện tại
  async recalculateTier(account) {
    const tiers = await LoyaltyTier.find().sort({ min_spent: 1 });
    const currentYear = new Date().getFullYear().toString();
    const spendingThisYear = account.yearly_spending?.[currentYear] || 0;
    let newTier = account.current_tier;
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (spendingThisYear >= tiers[i].min_spent) {
        newTier = tiers[i]._id;
        break;
      }
    }
    account.current_tier = newTier;
    return account;
  },

  // Cộng điểm và tổng chi tiêu (khi đơn hàng thành công)
  async addPoints(userId: string, orderId: string, amount: number) {
    const userObjectId = new Types.ObjectId(userId);
    const orderObjectId = new Types.ObjectId(orderId);
    let account = await LoyaltyAccount.findOne({ user_id: userObjectId });
    // Lấy danh sách tier, sort tăng dần theo min_spent
    const tiers = await LoyaltyTier.find().sort({ min_spent: 1 });
    const currentYear = new Date().getFullYear().toString();
    if (!account) {
  
      const lowestTier = tiers[0]?._id;
      account = await LoyaltyAccount.create({
        user_id: userObjectId,
        total_points: 0,
        total_spent: 0,
        current_tier: lowestTier,
        yearly_spending: { [currentYear]: 0 },
      });
    }
    // Tính điểm cộng thêm
    const addPoints = Math.floor(amount / POINTS_PER_AMOUNT);
    account.total_points += addPoints;
    // Cập nhật yearly_spending
    if (!account.yearly_spending) account.yearly_spending = {};
    if (!account.yearly_spending[currentYear]) account.yearly_spending[currentYear] = 0;
    account.yearly_spending[currentYear] += amount;
    account.markModified('yearly_spending');
    // Cập nhật total_spent là tổng tích lũy
    account.total_spent += amount;
    // Tìm tier phù hợp nhất dựa trên yearly_spending năm nay
    let newTier = account.current_tier;
    const spendingThisYear = account.yearly_spending[currentYear];
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (spendingThisYear >= tiers[i].min_spent) {
        newTier = tiers[i]._id as Types.ObjectId;
        break;
      }
    }
    account.current_tier = newTier;
    await account.save();
    // Ghi nhận transaction
    await LoyaltyTransaction.create({
      account_id: account._id,
      order_id: orderObjectId,
      points: addPoints,
      amount: amount,
      type: 'earn',
      note: `Cộng điểm từ đơn hàng ${orderId}`,
    });
    return {
      total_points: account.total_points,
      total_spent: account.total_spent,
      current_tier: account.current_tier,
      added_points: addPoints,
    };
  },
};

export default LoyaltyService; 