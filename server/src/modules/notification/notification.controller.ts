import { Response } from 'express';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { NotificationService } from './notification.service';

const notificationService = new NotificationService();

/**
 * GET /api/notifications
 * Get all notifications for the authenticated user
 */
export async function getNotificationsHandler(
    req: AuthenticatedRequest, res: Response
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const notifications = await notificationService.getNotifications(userId);
        res.status(200).json(notifications);
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to fetch notifications';
        res.status(500).json({ error: msg });
    }
}

/**
 * GET /api/notifications/unread-count
 * Get the count of unread notifications for the authenticated user
 */
export async function getUnreadCountHandler(
    req: AuthenticatedRequest, res: Response
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const count = await notificationService.getUnreadCount(userId);
        res.status(200).json({ count });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to fetch unread count';
        res.status(500).json({ error: msg });
    }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a specific notification as read
 */
export async function markAsReadHandler(
    req: AuthenticatedRequest, res: Response
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const notificationId = req.params.id;
        await notificationService.markAsRead(notificationId, userId);
        res.status(200).json({ success: true });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to mark notification as read';
        res.status(500).json({ error: msg });
    }
}

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read for the authenticated user
 */
export async function markAllAsReadHandler(
    req: AuthenticatedRequest, res: Response
): Promise<void> {
    try {
        const userId = req.user!.userId;
        await notificationService.markAllAsRead(userId);
        res.status(200).json({ success: true });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to mark all as read';
        res.status(500).json({ error: msg });
    }
}
