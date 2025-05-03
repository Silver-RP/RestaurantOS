import { registerSwaggerRoute } from '../utils/swaggerOptions';

registerSwaggerRoute({
  path: '/cart/update/{id}',
  method: 'put',
  summary: 'Update cart (add, increase, decrease, or remove dish)',
  description: `Update the cart by adding a new dish, increasing or decreasing the quantity of an existing dish.
    - If dish exists and quantity > 0 ➔ increase quantity.
    - If dish exists and quantity < 0 ➔ decrease quantity.
    - If quantity becomes 0 after update ➔ remove dish from cart.
    - If dish does not exist and quantity > 0 ➔ add new dish.
    - If dish does not exist and quantity < 0 ➔ throw error.`,
  parameters: [
    {
      in: 'path',
      name: 'id',
      schema: { type: 'string' },
      required: true,
      description: 'Cart ID (from path parameter)',
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            dishId: {
              type: 'string',
              description: 'Dish ID to add, increase, or decrease',
            },
            quantity: {
              type: 'integer',
              description: 'Quantity change (positive to increase, negative to decrease)',
            },
          },
          required: ['dishId', 'quantity'],
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Cart updated successfully (add/increase/decrease/remove)',
    },
    400: { description: 'Invalid input or quantity' },
    404: { description: 'Cart or Dish not found' },
    500: { description: 'Internal server error' },
  },
  tags: ['Cart'],
});
registerSwaggerRoute({
  path: '/cart/{cartId}/item/{dishId}',
  method: 'delete',
  summary: 'Delete a specific item from the cart',
  description: 'Remove a dish from the cart by dishId.',
  parameters: [
    {
      in: 'path',
      name: 'cartId',
      schema: { type: 'string' },
      required: true,
      description: 'Cart ID',
    },
    {
      in: 'path',
      name: 'dishId',
      schema: { type: 'string' },
      required: true,
      description: 'Dish ID',
    },
  ],
  responses: {
    200: { description: 'Cart item deleted successfully' },
    400: { description: 'Missing cartId or dishId' },
    404: { description: 'Cart or item not found' },
    500: { description: 'Internal server error' },
  },
  tags: ['Cart'],
});
registerSwaggerRoute({
  path: '/cart/delete-all/{cartId}',
  method: 'delete',
  summary: 'Delete all items in the cart',
  description: 'Remove all dishes in the cart, keeping the cart itself.',
  parameters: [
    {
      in: 'path',
      name: 'cartId',
      schema: { type: 'string' },
      required: true,
      description: 'Cart ID',
    },
  ],
  responses: {
    200: { description: 'All items deleted successfully' },
    400: { description: 'Missing cartId' },
    404: { description: 'Cart not found' },
    500: { description: 'Internal server error' },
  },
  tags: ['Cart'],
});
