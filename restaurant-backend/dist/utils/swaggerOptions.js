"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSwaggerRoute = registerSwaggerRoute;
exports.getSwaggerRoutes = getSwaggerRoutes;
exports.generateSwaggerSpec = generateSwaggerSpec;
// Biến toàn cục để lưu trữ tất cả metadata của các route
const swaggerRoutes = [];
// Hàm để đăng ký metadata Swagger cho một route
function registerSwaggerRoute(options) {
    const routeMetadata = {
        path: options.path || '',
        method: options.method || 'get',
        summary: options.summary || '',
        description: options.description || '',
        responses: options.responses || {
            200: { description: 'Success' },
        },
        requestBody: options.requestBody,
        parameters: options.parameters || [],
        tags: options.tags || [],
        security: options.security || [],
    };
    swaggerRoutes.push(routeMetadata);
}
// Hàm để lấy tất cả metadata đã đăng ký
function getSwaggerRoutes() {
    return swaggerRoutes;
}
// Hàm để tạo Swagger specification từ metadata
function generateSwaggerSpec(routes, swaggerConfig) {
    const paths = {};
    routes.forEach((route) => {
        const path = route.path;
        const method = route.method.toLowerCase();
        if (!paths[path]) {
            paths[path] = {};
        }
        paths[path][method] = {
            summary: route.summary,
            description: route.description,
            responses: route.responses,
            requestBody: route.requestBody,
            parameters: route.parameters,
            tags: route.tags,
            security: route.security,
        };
    });
    return Object.assign(Object.assign({}, swaggerConfig), { info: swaggerConfig.info || {
            title: 'API Documentation',
            version: '1.0.0',
        }, tags: [
            {
                name: 'Auth',
                description: 'Authentication APIs',
                'x-order': 1,
            },
            {
                name: 'Cart',
                description: 'Cart APIs',
                'x-order': 2,
            },
        ], paths });
}
