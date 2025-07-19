import axiosInstance from './axiosInstance';

// Lấy thông tin tài khoản loyalty của user hiện tại
export async function getLoyaltyAccountInfo() {
  const response = await axiosInstance.get('/loyalty/account');
  return response.data;
}

// Lấy lịch sử giao dịch điểm
export async function getLoyaltyTransactionHistory() {
  const response = await axiosInstance.get('/loyalty/transactions');
  return response.data;
}

// Lấy lịch sử các mốc đã đạt được
export async function getUserMilestones() {
  const response = await axiosInstance.get('/loyalty/milestones');
  return response.data;
}

// Lấy danh sách tất cả các tier
export async function getAllTiers() {
  const response = await axiosInstance.get('/loyalty/tiers');
  return response.data;
}

// Lấy các tier active (cho user)
export async function getActiveTiers() {
  const response = await axiosInstance.get('/loyalty/tiers/active');
  return response.data;
}

// ===== ADMIN APIs =====
// Lấy tất cả định nghĩa milestone
export async function getAllMilestoneDefinitions() {
  const response = await axiosInstance.get('/loyalty/milestone-definitions');
  return response.data;
}

// Tạo định nghĩa milestone mới
export async function createMilestoneDefinition(data: {
  milestone_amount: number;
  milestone_name: string;
  description: string;
  voucher_id?: string;
}) {
  const response = await axiosInstance.post('/loyalty/milestone-definitions', data);
  return response.data;
}

// Cập nhật định nghĩa milestone
export async function updateMilestoneDefinition(id: string, data: {
  milestone_name?: string;
  description?: string;
  voucher_id?: string;
  is_active?: boolean;
}) {
  const response = await axiosInstance.put(`/loyalty/milestone-definitions/${id}`, data);
  return response.data;
}

// Xóa định nghĩa milestone
export async function deleteMilestoneDefinition(id: string) {
  const response = await axiosInstance.delete(`/loyalty/milestone-definitions/${id}`);
  return response.data;
}

// Lấy các mốc quà tặng active (cho user)
export async function getActiveMilestoneDefinitions() {
  const response = await axiosInstance.get('/loyalty/milestone-definitions/active');
  return response.data;
}

// ===== TIER MANAGEMENT APIs =====
// Tạo tier mới
export async function createTier(data: {
  tier_name: 'new' | 'bronze' | 'silver' | 'gold' | 'diamond';
  min_spent: number;
  discount: number;
  benefits?: string;
}) {
  const response = await axiosInstance.post('/loyalty/tiers', data);
  return response.data;
}

// Cập nhật tier
export async function updateTier(id: string, data: {
  tier_name?: 'new' | 'bronze' | 'silver' | 'gold' | 'diamond';
  min_spent?: number;
  discount?: number;
  benefits?: string;
  is_active?: boolean;
}) {
  const response = await axiosInstance.put(`/loyalty/tiers/${id}`, data);
  return response.data;
}

// Xóa tier
export async function deleteTier(id: string) {
  const response = await axiosInstance.delete(`/loyalty/tiers/${id}`);
  return response.data;
}

// ===== TRANSACTION MANAGEMENT APIs =====
// Lấy tất cả giao dịch (cho admin)
export async function getAllLoyaltyTransactions(params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}) {
  const response = await axiosInstance.get('/loyalty/admin/transactions', { params });
  return response.data;
}

// ===== ACCOUNT MANAGEMENT APIs =====
// Lấy tất cả tài khoản loyalty (cho admin)
export async function getAllLoyaltyAccounts(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const response = await axiosInstance.get('/loyalty/admin/accounts', { params });
  return response.data;
}

// Lấy chi tiết tài khoản loyalty của user cụ thể (cho admin)
export async function getLoyaltyAccountByUserId(userId: string) {
  const response = await axiosInstance.get(`/loyalty/admin/accounts/${userId}`);
  return response.data;
}

// Cập nhật tài khoản loyalty (admin)
export async function updateLoyaltyAccount(id: string, data: {
  current_tier?: string;
  total_points?: number;
  total_spent?: number;
}) {
  const response = await axiosInstance.put(`/loyalty/admin/accounts/${id}`, data);
  return response.data;
}

