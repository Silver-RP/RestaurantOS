import { registerSwaggerRoute } from '../utils/swaggerOptions';

registerSwaggerRoute({
  path: '/food/getFoodNewest',
  method: 'get',
  tags: ['Food'],
});

registerSwaggerRoute({
  path: '/food/getFoodBest4',
  method: 'get',
  tags: ['Food'],
});

registerSwaggerRoute({
  path: '/food/favorite',
  method: 'post',
  summary: 'Toggle favorite food',
  description: 'Toggle a dish as favorite/unfavorite for the current authenticated user',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            dishId: { type: 'string', example: '6803982ea6e191b3ff6192de' },
          },
          required: ['dishId'],
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: 'Favorite toggled successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Favorite added successfully' },
              data: {
                type: 'object',
                properties: {
                  userId: { type: 'string', example: '6810b5fdb65d24bde710934c' },
                  dishId: { type: 'string', example: '6803982ea6e191b3ff6192de' },
                  createdAt: { type: 'string', example: '2025-05-02T12:00:00.000Z' },
                  updatedAt: { type: 'string', example: '2025-05-02T12:00:00.000Z' },
                  _id: { type: 'string', example: '689c1b2fa1e1929cfe7c9ae0' },
                },
              },
            },
          },
        },
      },
    },
    400: { description: 'Bad request - dishId missing or invalid' },
    401: { description: 'Unauthorized - user not logged in' },
    500: { description: 'Internal server error' },
  },
  security: [{ bearerAuth: [], }],
  tags: ['Food'],
});

registerSwaggerRoute({
  path: '/food/getFavoriteFoods',
  method: 'get',
  summary: 'Get favorite foods of user',
  description: 'Retrieve the list of favorite dishes for the currently authenticated user',
  responses: {
    200: {
      description: 'Favorite foods retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Favorite foods retrieved successfully' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string', example: '689c1b2fa1e1929cfe7c9ae0' },
                    userId: { type: 'string', example: '6810b5fdb65d24bde710934c' },
                    dishId: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string', example: '6803982ea6e191b3ff6192de' },
                        name: { type: 'string', example: 'Bò Wagyu nướng tảng kiểu Nhật' },
                        price: { type: 'number', example: 450000 },
                        // thêm các field cần thiết từ Dish
                      },
                    },
                    createdAt: { type: 'string', example: '2025-05-02T12:00:00.000Z' },
                    updatedAt: { type: 'string', example: '2025-05-02T12:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },
    401: { description: 'Unauthorized - user not logged in' },
    404: { description: 'No favorite foods found' },
    500: { description: 'Internal server error' },
  },
  tags: ['Food'],
  security: [
    {
      bearerAuth: [],
    },
  ],
});

