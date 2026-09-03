import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const env = {
  PORT: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/madrasa_payment_tracker',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'madrasa_jwt_access_secret_key_2026',
    ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'madrasa_jwt_refresh_secret_key_2026',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};
