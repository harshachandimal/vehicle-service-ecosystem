import dotenv from 'dotenv';
import { createApp } from './app';
import { PrismaService } from './common/prisma.service';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Start the Express server
 * Initializes database connection and starts listening for requests
 */
async function startServer(): Promise<void> {
    try {
        // Connect to database
        await PrismaService.connect();

        // Create and start Express app
        const app = createApp();

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
        });

        // Graceful shutdown handling
        setupGracefulShutdown(server);
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

/**
 * Configure graceful shutdown handlers
 * Ensures clean disconnection from database and server
 * 
 * @param {any} server - HTTP server instance
 */
function setupGracefulShutdown(server: any): void {
    const shutdown = async (signal: string) => {
        console.log(`\n${signal} received. Starting graceful shutdown...`);

        server.close(async () => {
            console.log('HTTP server closed');
            await PrismaService.disconnect();
            process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.error('Forced shutdown due to timeout');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

// Start the server
startServer();
