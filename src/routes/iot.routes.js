import express from 'express';
const router = express.Router();
import { receiveSensorData } from '../controllers/iot.controller.js';

router.post('/sensor-data', receiveSensorData);

export default router;
