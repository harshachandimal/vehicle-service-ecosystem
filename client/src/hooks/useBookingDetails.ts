import { useState, useEffect } from 'react';
import { bookingApi, type BookingResponse } from '../api/booking.api';
import { socketClient } from '../utils/socket';
import { useAuth } from './useAuth';

export function useBookingDetails(id?: string) {
    const { user } = useAuth();
    const [booking, setBooking] = useState<BookingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookingDetails = async () => {
        if (!id) return;
        setLoading(true);
        try {
            // Using getBookingById since it's available in bookingApi
            const data = await bookingApi.getBookingById(id);
            setBooking(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch booking details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingDetails();

        if (user?.id && id) {
            socketClient.connect();
            socketClient.join(user.id);

            const handleUpdate = (data: any) => {
                if (data.bookingId === id) {
                    console.log('🔄 Booking update received via socket');
                    fetchBookingDetails();
                }
            };

            socketClient.on('booking_updated', handleUpdate);
            socketClient.on('invoice_updated', handleUpdate);

            return () => {
                socketClient.off('booking_updated', handleUpdate);
                socketClient.off('invoice_updated', handleUpdate);
            };
        }
    }, [id, user?.id]);

    return { booking, loading, error, refetch: fetchBookingDetails };
}
