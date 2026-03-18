import { NotificationRepository } from './notification.repository';

const notificationRepository = new NotificationRepository();

export class NotificationService {
    /**
     * Create a notification for a user (called internally by other services)
     */
    async createNotification(data: {
        userId: string;
        title: string;
        message: string;
        bookingId?: string;
    }) {
        return notificationRepository.create(data);
    }

    /**
     * Get all notifications for a user
     */
    async getNotifications(userId: string) {
        return notificationRepository.findByUserId(userId);
    }

    /**
     * Get unread notification count for a user
     */
    async getUnreadCount(userId: string) {
        return notificationRepository.getUnreadCount(userId);
    }

    /**
     * Mark a specific notification as read
     */
    async markAsRead(notificationId: string, userId: string) {
        return notificationRepository.markAsRead(notificationId, userId);
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string) {
        return notificationRepository.markAllAsRead(userId);
    }
}
