import { Router } from 'express';
import Sample from '../models/sampleModel';

const router = Router();

router.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/db', async (req, res) => {
  try {
    const sampleData = await Sample.create({
        name: 'Sample Data',
        description: 'This is a sample document',
    });
    res.status(201).json({ message: 'Data added successfully', data: sampleData });
} catch (error) {
    res.status(500).json({ message: 'Error adding data', error });
}
});

export default router;
