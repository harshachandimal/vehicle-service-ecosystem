import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaService } from './common/prisma.service';
import authRoutes from './modules/auth/auth.routes';

/**
 * Creates and configures the Express application
 * Follows separation of concerns by keeping app configuration separate from server startup
 * 
 * @returns {Application} Configured Express application
 */
export function createApp(): Application {
    const app = express();

    // Middleware setup
    configureMiddleware(app);

    // Routes setup
    configureRoutes(app);

    // Error handling
    configureErrorHandling(app);

    return app;
}

/**
 * Configure application middleware
 * 
 * @param {Application} app - Express application instance
 */
function configureMiddleware(app: Application): void {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

/**
 * Configure application routes
 * 
 * @param {Application} app - Express application instance
 */
function configureRoutes(app: Application): void {
    // Health check endpoint
    app.get('/health', healthCheckHandler);

    // API routes
    app.use('/api/auth', authRoutes);
}

/**
 * Health check endpoint handler
 * Verifies server and database connectivity
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
async function healthCheckHandler(_req: Request, res: Response): Promise<void> {
    const dbHealthy = await PrismaService.healthCheck();

    res.status(dbHealthy ? 200 : 503).json({
        status: dbHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        database: dbHealthy ? 'connected' : 'disconnected',
    });
}

/**
 * Configure global error handling middleware
 * 
 * @param {Application} app - Express application instance
 */
function configureErrorHandling(app: Application): void {
    // 404 handler
    app.use((_req: Request, res: Response) => {
        res.status(404).json({ error: 'Route not found' });
    });

    // Global error handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error('Unhandled error:', err);
        res.status(500).json({ error: 'Internal server error' });
    });
}
