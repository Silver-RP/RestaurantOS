"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOptions_1 = require("./utils/swaggerOptions");
const HealthChecks_1 = __importDefault(require("./routes/HealthChecks"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const RoleRouter_1 = __importDefault(require("./routes/RoleRouter"));
const CategoryRoutes_1 = __importDefault(require("./routes/CategoryRoutes"));
const ReservationContactRoutes_1 = __importDefault(require("./routes/ReservationContactRoutes"));
const ReservationDetailContactRoutes_1 = __importDefault(require("./routes/ReservationDetailContactRoutes"));
const ProfileRoutes_1 = __importDefault(require("./routes/ProfileRoutes"));
const SearchRoutes_1 = __importDefault(require("./routes/SearchRoutes"));
const StaffRoutes_1 = __importDefault(require("./routes/StaffRoutes"));
const FoodRoutes_1 = __importDefault(require("./routes/FoodRoutes"));
const PermissionRoutes_1 = __importDefault(require("./routes/PermissionRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Import file authSwagger để đăng ký metadata
require("./swaggers/AuthSwagger");
dotenv_1.default.config();
(0, db_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
const port = process.env.PORT || 4000;
// Cấu hình Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the application',
    },
    servers: [
        {
            url: `http://localhost:${port}/api`,
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};
const allRoutes = (0, swaggerOptions_1.getSwaggerRoutes)();
// Tạo Swagger specification
const swaggerSpec = (0, swaggerOptions_1.generateSwaggerSpec)(allRoutes, swaggerDefinition);
// Thiết lập Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use(passport_1.default.initialize());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send('API is running...');
});
// Định nghĩa routes
app.use('/api/auth', AuthRoutes_1.default);
app.use('/api/user', UserRoutes_1.default);
app.use('/api/profile', ProfileRoutes_1.default);
app.use('/api/role', RoleRouter_1.default);
app.use('/api/permission', PermissionRoutes_1.default);
app.use('/api/category', CategoryRoutes_1.default);
app.use('/api/reservationcontact', ReservationContactRoutes_1.default);
app.use('/api/reservationdetailcontact', ReservationDetailContactRoutes_1.default);
app.use('/api/search', SearchRoutes_1.default);
app.use('/api/staff', StaffRoutes_1.default);
app.use('/api/food', FoodRoutes_1.default);
app.use('/api', HealthChecks_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Mongo URI:', process.env.MONGO_URI);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
// function cors(arg0: { origin: string; credentials: boolean; }): any {
//   throw new Error('Function not implemented.');
// }
