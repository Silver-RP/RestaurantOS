import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1).max(100),
  unit: z.enum([
    'kg', 'gram', 'mg',
    'litre', 'ml',
    'pcs', 'pack', 'box', 'bottle', 'can', 'unit',
  ]),
  price_per_unit: z.number().min(0).transform((val) => parseFloat(val.toFixed(2))),
});

export type IngredientInput = z.infer<typeof ingredientSchema>;