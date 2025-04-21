"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
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
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
// import './insertData'; 
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Mongo URI:', process.env.MONGO_URI);
});
const swaggerDocument = yamljs_1.default.load(path_1.default.resolve(__dirname, './config/swagger.yml') // ✅ đúng hơn với dự án của bạn
);
app.use("/api-docs", swagger_ui_express_1.default.serve, (req, res, next) => {
    return swagger_ui_express_1.default.setup(swaggerDocument)(req, res, next);
});
app.use(passport_1.default.initialize());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/auth', AuthRoutes_1.default);
app.use('/api/user', UserRoutes_1.default);
app.use('/api/profile', ProfileRoutes_1.default);
app.use("/api/role", RoleRouter_1.default);
app.use("/api/permission", PermissionRoutes_1.default);
app.use("/api/category", CategoryRoutes_1.default);
app.use("/api/reservationcontact", ReservationContactRoutes_1.default);
app.use("/api/reservationdetailcontact", ReservationDetailContactRoutes_1.default);
app.use("/api/search", SearchRoutes_1.default);
app.use("/api/staff", StaffRoutes_1.default);
app.use("/api/food", FoodRoutes_1.default);
app.use('/api', HealthChecks_1.default);
