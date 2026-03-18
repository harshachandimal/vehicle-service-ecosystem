import { PrismaService } from '../../common/prisma.service';

const prisma = PrismaService.getInstance();

export class NotificationRepository {
    /**
     * Create a new notification for a user
     */
    async create(data: {
        userId: string;
        title: string;
        message: string;
        bookingId?: string;
    }) {
        return prisma.notification.create({ data });
    }

    /**
     * Get all notifications for a user, most recent first
     */
    async findByUserId(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    /**
     * Count unread notifications for a user
     */
    async getUnreadCount(userId: string): Promise<number> {
        return prisma.notification.count({
            where: { userId, isRead: false },
        });
    }

    /**
     * Mark a single notification as read
     */
    async markAsRead(id: string, userId: string) {
        return prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
}
