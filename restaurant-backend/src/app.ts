import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateSwaggerSpec, getSwaggerRoutes } from './utils/swaggerOptions';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';
import RoleRoutes from './routes/RoleRouter';
import CateRoutes from './routes/CategoryRoutes';
import ReservationContactRoutes from './routes/ReservationContactRoutes';
import ReservationDetailContactRoutes from './routes/ReservationDetailContactRoutes';
import ProfileRoutes from './routes/ProfileRoutes';
import SearchRoutes from './routes/SearchRoutes';
import StaffRoutes from './routes/StaffRoutes';
import FoodRoutes from './routes/FoodRoutes';
import PermissionRoutes from './routes/PermissionRoutes';
import OrderRoutes from './routes/OrderRoutes';
import AuthMiddleWare from './middleware/AuthMiddleWare';
import CartRouter from './routes/CartRoutes';
import AddressRouter from './routes/AddressRoutes';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';

const app = express();

// Import file authSwagger để đăng ký metadata
import './swaggers/AuthSwagger';
import './swaggers/OrderSwagger';
import './swaggers/FoodSwagger';
import './swaggers/CartSwagger';
import './swaggers/StaffSwagger';
import './swaggers/UserSwagger';
import './swaggers/CategorySwagger';


dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

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

const allRoutes = getSwaggerRoutes();

// Tạo Swagger specification
const swaggerSpec = generateSwaggerSpec(allRoutes, swaggerDefinition);

// Thiết lập Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Định nghĩa routes
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/profile', AuthMiddleWare.verifyToken, ProfileRoutes);
app.use('/api/role', RoleRoutes);
app.use('/api/permission', PermissionRoutes);
app.use('/api/category', CateRoutes);
app.use('/api/reservationcontact', ReservationContactRoutes);
app.use('/api/reservationdetailcontact', ReservationDetailContactRoutes);
app.use('/api/search', SearchRoutes);
app.use(
  '/api/staff',
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.verifyRole(['superadmin', 'manager',]),
  StaffRoutes
);

app.use('/api/food', FoodRoutes);
app.use('/api/order', AuthMiddleWare.verifyToken, OrderRoutes);
app.use('/api/cart', AuthMiddleWare.verifyToken, CartRouter);
app.use('/api/address', AuthMiddleWare.verifyToken, AddressRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Mongo URI:', process.env.MONGO_URI);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
