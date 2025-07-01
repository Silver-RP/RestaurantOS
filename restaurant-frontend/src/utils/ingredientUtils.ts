import { ingredientUnits } from '../types/ingredientUnitsType';
  
  export function getIngredientUnitLabel(value: string): string {
    return ingredientUnits.find((unit) => unit.value === value)?.label || value;
  }
  
  const unitMultipliers: Record<string, number> = {
    mg: 0.001,
    gram: 1,
    kg: 1000,
    ml: 1,
    litre: 1000,
  };
  
  export function convertThreshold(value: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return value;
    const from = unitMultipliers[fromUnit];
    const to = unitMultipliers[toUnit];
    if (!from || !to) return value; 
    return Math.round((value * from) / to);
  }
  
  const unitThresholds: Record<string, number> = {
    mg: 100000,
    gram: 1000,
    kg: 5,
    ml: 1000,
    litre: 3,
    pcs: 10,
    unit: 10,
    bottle: 5,
    can: 5,
    pack: 3,
    box: 2,
  };
  
  type StockStatus = {
    label: string;
    color: 'red' | 'yellow' | 'green';
  };
  
  export function getStockStatus(
    count: number,
    unit: string,
    customThreshold?: number | null
  ): StockStatus {
    if (count <= 0) return { label: '❌ Đã hết', color: 'red' };
  
    const defaultThreshold = unitThresholds[unit] ?? 10;
    const threshold = customThreshold ?? defaultThreshold;
  
    if (count <= threshold) return { label: '⚠ Sắp hết', color: 'yellow' };
  
    return { label: '✅ Còn đủ', color: 'green' };
  }
  