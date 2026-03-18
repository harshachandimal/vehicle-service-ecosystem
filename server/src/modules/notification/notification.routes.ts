import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import {
    getNotificationsHandler,
    getUnreadCountHandler,
    markAsReadHandler,
    markAllAsReadHandler,
} from './notification.controller';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// GET /api/notifications - Get all notifications
router.get('/', getNotificationsHandler);

// GET /api/notifications/unread-count - Get count of unread notifications
router.get('/unread-count', getUnreadCountHandler);

// PATCH /api/notifications/read-all - Mark all notifications as read
router.patch('/read-all', markAllAsReadHandler);

// PATCH /api/notifications/:id/read - Mark a specific notification as read
router.patch('/:id/read', markAsReadHandler);

export default router;
