"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerOptions_1 = require("../utils/swaggerOptions");
(0, swaggerOptions_1.registerSwaggerRoute)({
    path: '/auth/register',
    method: 'post',
    summary: 'User registration',
    description: 'Register a new user with username, email, password, phone, and optional roles',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', example: 'johndoe@example.com' },
                        password: { type: 'string', example: 'Password123' },
                        confirmPassword: { type: 'string', example: 'Password123' },
                        phone: { type: 'string', example: '+12345678901' },
                        roles: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['507f1f77bcf86cd799439011'],
                        },
                    },
                    required: [
                        'username',
                        'email',
                        'password',
                        'confirmPassword',
                        'phone',
                    ],
                },
            },
        },
        required: true,
    },
    responses: {
        201: { description: 'User created successfully' },
        400: { description: 'Bad request - Invalid input or role ID format' },
    },
    tags: ['Auth'],
});
