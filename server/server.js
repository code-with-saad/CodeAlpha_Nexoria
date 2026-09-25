import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body Parsers & CORS Middleware
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use((req, res, next) => {
  connectDB().then(() => next()).catch(next);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route & API Info
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'Nexoria E-Commerce API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Database Connection Test Endpoint
app.get('/api/health/db', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  if (dbState === 1) {
    return res.status(200).json({
      success: true,
      status: 'MongoDB Connected',
      host: mongoose.connection.host,
      database: mongoose.connection.name
    });
  } else {
    return res.status(200).json({
      success: false,
      status: 'MongoDB Disconnected or Awaiting Local Daemon',
      state: stateMap[dbState] || 'disconnected',
      message: 'Server is active. Set MONGO_URI in server/.env or start local mongod service when ready.'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares (Must be defined last)
app.use(notFound);
app.use(errorHandler);

// Start Express Server (only when run directly in dev)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Nexoria Server running on port ${PORT} (http://localhost:${PORT})`);
  });
}

export default app;
