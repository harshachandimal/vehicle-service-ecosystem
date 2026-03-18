import api from './auth.api';

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    bookingId?: string;
    createdAt: string;
}

export const notificationApi = {
    /**
     * Get all notifications for the authenticated user
     */
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get<Notification[]>('/api/notifications');
        return response.data;
    },

    /**
     * Get the count of unread notifications
     */
    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ count: number }>('/api/notifications/unread-count');
        return response.data.count;
    },

    /**
     * Mark a specific notification as read
     * @param id - Notification ID
     */
    markAsRead: async (id: string): Promise<void> => {
        await api.patch(`/api/notifications/${id}/read`);
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<void> => {
        await api.patch('/api/notifications/read-all');
    },
};
