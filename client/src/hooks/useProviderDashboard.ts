import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { bookingApi } from '../api/booking.api';
import { socketClient } from '../utils/socket';
import type { BookingResponse } from '../api/booking.api';

export function useProviderDashboard() {
    const { user, token, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await bookingApi.getProviderBookings();
            setBookings(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch bookings');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (token && user?.role === 'PROVIDER' && user?.id) {
            fetchBookings();

            socketClient.connect();
            socketClient.join(user.id);

            const handleUpdate = () => {
                console.log('🔄 Provider dashboard update received via socket');
                fetchBookings();
            };

            socketClient.on('booking_updated', handleUpdate);
            socketClient.on('invoice_updated', handleUpdate);

            return () => {
                socketClient.off('booking_updated', handleUpdate);
                socketClient.off('invoice_updated', handleUpdate);
            };
        }
    }, [token, user?.role, user?.id, fetchBookings]);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await bookingApi.updateBookingStatus(id, status);
            // Re-fetch after updating status
            fetchBookings();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update booking status');
        }
    };

    // Calculate metrics
    const metrics = useMemo(() => ({
        pendingRequests: bookings.filter(b => b.status === 'PENDING').length,
        upcomingAppointments: bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS').length,
        completedServices: bookings.filter(b => b.status === 'COMPLETED').length,
    }), [bookings]);

    // Search filter
    const filteredBookings = useMemo(() => {
        if (!searchQuery.trim()) return bookings;
        const query = searchQuery.toLowerCase();
        return bookings.filter(b => 
            (b.service?.name || 'General Service').toLowerCase().includes(query) ||
            (b.vehicle?.ownerName || '').toLowerCase().includes(query) ||
            (b.vehicle?.make || '').toLowerCase().includes(query) ||
            (b.vehicle?.model || '').toLowerCase().includes(query) ||
            (b.vehicle?.licensePlate || '').toLowerCase().includes(query) ||
            (b.description || '').toLowerCase().includes(query)
        );
    }, [bookings, searchQuery]);

    return {
        user,
        token,
        authLoading,
        bookings,
        filteredBookings,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        metrics,
        handleStatusUpdate,
        fetchBookings
    };
}
