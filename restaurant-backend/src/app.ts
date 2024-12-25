import express from 'express';
import healthCheckRoutes from './routes/healthcheck';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from "./routes/UserRoutes"; 
import dotenv from 'dotenv';
import connectDB from './config/db';
import cookieParser from "cookie-parser"; 
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const port = 3003;
app.use(cookieParser());
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api', healthCheckRoutes);


const PORT = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

