import { getStockStatus } from '../../../../utils/ingredientUtils';
import { Ingredient } from '@/types/IngredientType';

type Props = {
  item: Ingredient;
};

const IngredientStockStatus = ({ item }: Props) => {
  const { label, color } = getStockStatus(
    item.currentStock,
    item.unit,
    item.lowStockThreshold ?? null
  );

  return <span className={`text-${color}-600 font-medium`}>{label}</span>;
};

export default IngredientStockStatus;
