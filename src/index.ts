import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

const startServer = async () => {
  try {
    // Connect Database
    await connectDatabase();

    // Start Express Server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Madrasa Payment Tracker Server is running at http://localhost:${env.PORT}`);
      console.log(`📡 Environment: ${env.NODE_ENV}`);
    });

    // Handle Uncaught Exceptions & Unhandled Rejections
    process.on('unhandledRejection', (reason: any) => {
      console.error('💥 Unhandled Rejection:', reason);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('uncaughtException', (err: Error) => {
      console.error('💥 Uncaught Exception:', err);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
