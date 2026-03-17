import { useState, useEffect } from 'react';
import { bookingApi, type BookingResponse } from '../api/booking.api';

export function useBookingDetails(id?: string) {
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
    }, [id]);

    return { booking, loading, error, refetch: fetchBookingDetails };
}
