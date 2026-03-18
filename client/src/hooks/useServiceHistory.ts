import { useState, useEffect } from 'react';
import { bookingApi } from '../api/booking.api';
import type { BookingResponse } from '../api/booking.api';
import { socketClient } from '../utils/socket';
import { useAuth } from './useAuth';

export const useServiceHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getMyBookings();
      // Filter for completed or cancelled bookings for history
      const historyData = data.filter(booking => 
        ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(booking.status)
      );
      setHistory(historyData);
    } catch (err) {
      setError('Failed to load service history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    if (user?.id) {
      socketClient.connect();
      socketClient.join(user.id);

      const handleUpdate = () => {
        console.log('🔄 Service history update received via socket');
        fetchHistory();
      };

      socketClient.on('booking_updated', handleUpdate);
      socketClient.on('invoice_updated', handleUpdate);

      return () => {
        socketClient.off('booking_updated', handleUpdate);
        socketClient.off('invoice_updated', handleUpdate);
      };
    }
  }, [user?.id]);

  return {
    history,
    loading,
    error,
    refreshHistory: fetchHistory
  };
};
