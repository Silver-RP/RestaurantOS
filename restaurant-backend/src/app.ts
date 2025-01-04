import express from 'express';
import healthCheckRoutes from './routes/healthcheck';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from "./routes/UserRoutes"; 
import RoleRoutes from "./routes/RoleRouter";
import CateRoutes from "./routes/CategoryRoutes";
import ReservationContactRoutes from "./routes/ReservationContactRoutes";
import ReservationDetailContactRoutes from "./routes/ReservationDetailContactRoutes";
import ProfileRoutes from "./routes/ProfileRoutes";
import dotenv from 'dotenv';
import connectDB from './config/db';
import cookieParser from "cookie-parser"; 
import passport from "passport"; 
dotenv.config();
connectDB();

const app = express();
const port = 3003;
app.use(passport.initialize());
app.use(express.json());

app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/profile',ProfileRoutes);
app.use("/api/role", RoleRoutes); 
app.use("/api/category", CateRoutes);
app.use("/api/reservationcontact", ReservationContactRoutes);
app.use("/api/reservationdetailcontact", ReservationDetailContactRoutes);
app.use('/api', healthCheckRoutes);

const PORT = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

