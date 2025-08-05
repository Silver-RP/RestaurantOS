import { Request, Response } from 'express';

// Dữ liệu mẫu, sau này có thể lấy từ DB
const posts = [
  { id: 1, name: 'Tin tức' },
  { id: 2, name: 'Đội ngũ đầu bếp' },
  { id: 3, name: 'BEEF BEEF' },
];

const categories = [
  { id: 1, name: 'Đồ uống có cồn' },
  { id: 2, name: 'Ẩm thực & món ngon' },
  { id: 3, name: 'Món ăn gia đình' },
];

export const getSidebarData = (req: Request, res: Response) => {
  res.json({
    posts,
    categories,
  });
};
