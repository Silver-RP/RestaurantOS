export const ingredientUnits = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'gram', label: 'Gram' },
  { value: 'mg', label: 'Milligram' },
  { value: 'litre', label: 'Lít' },
  { value: 'ml', label: 'Mililít' },
  { value: 'pcs', label: 'Miếng, cái (PCS)' },
  { value: 'pack', label: 'Gói' },
  { value: 'box', label: 'Thùng' },
  { value: 'bottle', label: 'Chai' },
  { value: 'can', label: 'Lon' },
  { value: 'unit', label: 'Phần' },
];

export const getUnitLabel = (unit: string) => {
  return ingredientUnits.find(u => u.value === unit)?.label || unit;
};

export const IngredientGroup = [
  'Thịt',
  'Mì',
  'Hải sản',
  'Rau củ và nấm',
  'Gia vị và Nguyên liệu',
  'Sữa và Phô mai',
  'Tinh bột và Bánh',
  'Đồ uống có cồn',
  'Đồ uống không có cồn',
]

export const IngredientSubGroups: Record<string, string[]> = {
  'Thịt': ['Thịt bò', 'Thịt heo', 'Thịt gà', 'Xương', 'Thịt đặc biệt', 'Gia cầm khác'],
  'Hải sản': ['Cá', 'Tôm', 'Mực', 'Cua', 'Ngao', 'Sò', 'Hàu', 'Ốc', 'Ghẹ', 'Rong biển', 'Hải sản khác'],
  'Mì': ['Pasta', 'Mì Nhật','Mì tươi', 'Mì khô', 'Mì khác'],
  'Rau củ và nấm': ['Rau xanh', 'Củ quả', 'Nấm', 'Rau khác'],
  'Gia vị và Nguyên liệu': ['Muối', 'Đường', 'Tiêu', 'Nước mắm', 'Xì dầu', 'Hương liệu', 'Dầu', 'Phụ gia', 'Gia vị khác', 'Gia vị'],
  'Sữa và Phô mai': ['Sữa tươi', 'Sữa đặc', 'Phô mai miếng', 'Bơ', 'Kem', 'Phô mai khác'],
  'Tinh bột và Bánh': ['Gạo', 'Bánh mì', 'Bánh ngọt', 'Bánh quy', 'Bánh khác'],
  'Đồ uống có cồn': ['Bia', 'Rượu', 'Cooktail', 'Phụ gia Cooktail', 'Đồ uống có cồn khác'],
  'Đồ uống không có cồn': ['Nước lọc', 'Nước ngọt', 'Nước ép trái cây', 'Trà', 'Cà phê', 'Si rô', 'Sinh tố', 'Đồ uống không có cồn khác'],
};
