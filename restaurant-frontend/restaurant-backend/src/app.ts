import express from 'express';
import healthCheckRoutes from './routes/healthcheck';

import dotenv from 'dotenv';
import connectDB from './config/db';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', healthCheckRoutes);


const PORT = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

