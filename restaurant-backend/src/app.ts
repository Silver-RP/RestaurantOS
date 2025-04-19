import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import HealthCheckRoutes from './routes/HealthChecks';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from "./routes/UserRoutes"; 
import RoleRoutes from "./routes/RoleRouter";
import CateRoutes from "./routes/CategoryRoutes";
import ReservationContactRoutes from "./routes/ReservationContactRoutes";
import ReservationDetailContactRoutes from "./routes/ReservationDetailContactRoutes";
import ProfileRoutes from "./routes/ProfileRoutes";
import SearchRoutes from "./routes/SearchRoutes";
import StaffRoutes from "./routes/StaffRoutes";
import FoodRoutes from "./routes/FoodRoutes";
import PermissionRoutes from "./routes/PermissionRoutes";
import dotenv from 'dotenv';
import connectDB from './config/db';
import cookieParser from "cookie-parser"; 
import passport from "passport"; 
import  setupSwagger from './utils/swagger';
// import './insertData'; 
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Mongo URI:', process.env.MONGO_URI);
});
const swaggerDocument = yaml.load(
  path.resolve(__dirname, './config/swagger.yml') // ✅ đúng hơn với dự án của bạn
);

app.use("/api-docs", swaggerUi.serve, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return swaggerUi.setup(swaggerDocument)(req, res, next);
});
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/profile',ProfileRoutes);
app.use("/api/role", RoleRoutes); 
app.use("/api/permission", PermissionRoutes);
app.use("/api/category", CateRoutes);
app.use("/api/reservationcontact", ReservationContactRoutes);
app.use("/api/reservationdetailcontact", ReservationDetailContactRoutes);
app.use("/api/search", SearchRoutes);
app.use("/api/staff", StaffRoutes);
app.use("/api/food", FoodRoutes);
app.use('/api', HealthCheckRoutes);



