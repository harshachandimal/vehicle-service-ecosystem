import { useState, useEffect } from 'react';
import { vehicleApi } from '../api/vehicle.api';
import type { Vehicle } from '../api/vehicle.api';
import { bookingApi } from '../api/booking.api';
import type { BookingResponse } from '../api/booking.api';
import { socketClient } from '../utils/socket';
import { useAuth } from './useAuth';

export const useOwnerDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vData, bData] = await Promise.all([
        vehicleApi.getMyVehicles(),
        bookingApi.getMyBookings()
      ]);
      setVehicles(vData);
      setBookings(bData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (user?.id) {
      socketClient.connect();
      socketClient.join(user.id);

      const handleUpdate = () => {
        console.log('🔄 Dashboard update received via socket');
        fetchData();
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
    vehicles,
    bookings,
    loading,
    error,
    refreshData: fetchData
  };
};
