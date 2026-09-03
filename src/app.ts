import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { env } from './config/env';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';
import { authRoutes } from './modules/auth/auth.route';
import { userRoutes } from './modules/user/user.route';
import { semesterRoutes } from './modules/semester/semester.route';
import { guardianRoutes } from './modules/guardian/guardian.route';
import { studentRoutes } from './modules/student/student.route';
import { feeRoutes } from './modules/fee/fee.route';

const app: Application = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
  })
);

// Logging Middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static Uploads Serving
app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

// Apply General Rate Limiter
app.use('/api', apiRateLimiter);

// Health Check Endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Madrasa Payment Tracker API Server is running 🚀',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Register Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/fees', feeRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
