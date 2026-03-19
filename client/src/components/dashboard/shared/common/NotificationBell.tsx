import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { notificationApi } from '../../../../api/notification.api';
import type { Notification } from '../../../../api/notification.api';
import { useNavigate } from 'react-router-dom';

const POLL_INTERVAL_MS = 30_000; // 30 seconds

interface NotificationBellProps {
    /** URL prefix for booking navigation, e.g. '/dashboard/owner/bookings' */
    bookingUrlPrefix?: string;
}

export default function NotificationBell({ bookingUrlPrefix = '/dashboard/provider/bookings' }: NotificationBellProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Poll unread count every 30 seconds
    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationApi.getUnreadCount();
            setUnreadCount(count);
        } catch {
            // Silently ignore – the user is still logged in
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    // When dropdown opens, load full notification list
    const handleBellClick = async () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            setIsLoading(true);
            try {
                const data = await notificationApi.getNotifications();
                setNotifications(data);
            } catch {
                // ignore
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch {
            // ignore
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await notificationApi.markAsRead(notification.id);
            setNotifications(prev =>
                prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        if (notification.bookingId) {
            setIsOpen(false);
            navigate(`${bookingUrlPrefix}/${notification.bookingId}`);
        }
    };

    const formatTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60_000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                onClick={handleBellClick}
                className="relative p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                        <span className="text-sm font-semibold text-slate-200">Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                                <Bell className="w-8 h-8 mb-2 opacity-30" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors ${
                                        !notification.isRead ? 'bg-blue-600/5' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Unread indicator */}
                                        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                            !notification.isRead ? 'bg-blue-500' : 'bg-transparent'
                                        }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium leading-tight ${
                                                !notification.isRead ? 'text-slate-100' : 'text-slate-400'
                                            }`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1.5 text-slate-600">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[11px]">{formatTime(notification.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
