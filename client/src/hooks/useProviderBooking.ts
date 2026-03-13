import { useState, useEffect } from 'react';
import { bookingApi, type BookingResponse } from '../api/booking.api';

export function useProviderBooking(id?: string) {
    const [booking, setBooking] = useState<BookingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookingDetails = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await bookingApi.getProviderBookings();
            const foundBooking = data.find((b: BookingResponse) => b.id === id);

            if (foundBooking) {
                setBooking(foundBooking);
            } else {
                setError('Booking not found or you do not have permission to view it.');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch booking details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
        try {
            const updatedBooking = await bookingApi.updateBookingStatus(bookingId, newStatus);
            setBooking((prev: BookingResponse | null) => prev ? { ...prev, status: updatedBooking.status } : null);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update status');
        }
    };

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    return { booking, loading, error, handleStatusUpdate, refetch: fetchBookingDetails };
}
