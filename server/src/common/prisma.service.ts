import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Singleton pattern implementation
 * Manages a single database connection instance throughout the application lifecycle
 * 
 * @example
 * const prisma = PrismaService.getInstance();
 * const users = await prisma.user.findMany();
 */
export class PrismaService {
    private static instance: PrismaClient | null = null;

    /**
     * Private constructor to prevent direct instantiation
     * Use getInstance() instead
     */
    private constructor() { }

    /**
     * Get the singleton instance of PrismaClient
     * Creates a new instance if one doesn't exist
     * 
     * @returns {PrismaClient} The Prisma Client instance
     */
    public static getInstance(): PrismaClient {
        if (!PrismaService.instance) {
            PrismaService.instance = new PrismaClient({
                log: ['query', 'info', 'warn', 'error'],
            });
        }
        return PrismaService.instance;
    }

    /**
     * Connect to the database
     * Establishes a connection if not already connected
     * 
     * @returns {Promise<void>}
     */
    public static async connect(): Promise<void> {
        const client = PrismaService.getInstance();
        await client.$connect();
        console.log('✅ Database connected successfully');
    }

    /**
     * Disconnect from the database
     * Closes the connection and cleans up resources
     * Should be called during application shutdown
     * 
     * @returns {Promise<void>}
     */
    public static async disconnect(): Promise<void> {
        if (PrismaService.instance) {
            await PrismaService.instance.$disconnect();
            PrismaService.instance = null;
            console.log('🔌 Database disconnected');
        }
    }

    /**
     * Check database connection health
     * Executes a raw query to verify database connectivity
     * 
     * @returns {Promise<boolean>} True if database is accessible
     */
    public static async healthCheck(): Promise<boolean> {
        try {
            const client = PrismaService.getInstance();
            await client.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    }
}
