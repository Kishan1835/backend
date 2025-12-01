// src/app.js
import express from 'express';
import cors from 'cors';
const app = express();
import studentRoutes from './routes/students.routes.js';
import machineRoutes from './routes/machines.routes.js';
import iotRoutes from './routes/iot.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import itiRoutes from './routes/iti.routes.js';
import tradeRoutes from './routes/trades.routes.js';
import workerRoutes from './routes/workers.routes.js';
import maintenanceWorkerRoutes from './routes/maintenanceWorkers.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
// import auctionRoutes from './routes/auctions.routes.js';
// import scheduleLogRoutes from './routes/scheduleLogs.routes.js';
import errorHandler from './middleware/error.middleware.js';
import { authenticateToken } from './middleware/auth.middleware.js';

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/machines', authenticateToken, machineRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/maintenance', authenticateToken, maintenanceRoutes);
app.use('/api/itis', itiRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/maintenance-workers', authenticateToken, maintenanceWorkerRoutes);
app.use('/api/inventory', authenticateToken, inventoryRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
// app.use('/api/auctions', auctionRoutes);
// app.use('/api/schedule-logs', scheduleLogRoutes);

app.get('/', (req, res) => {
    res.send('PredictaLab Backend is running!');
});

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;