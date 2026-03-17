import { useState, useEffect } from 'react';
import { bookingApi } from '../api/booking.api';
import type { BookingResponse } from '../api/booking.api';

export const useServiceHistory = () => {
  const [history, setHistory] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const bookings = await bookingApi.getMyBookings();
      
      // Filter for completed bookings
      const completedBookings = bookings.filter(
        (booking) => booking.status === 'COMPLETED'
      );
      
      // Sort by date (newest first)
      const sortedHistory = completedBookings.sort((a, b) => 
        new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
      );

      setHistory(sortedHistory);
    } catch (err) {
      setError('Failed to load service history. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    error,
    refreshHistory: fetchHistory
  };
};
