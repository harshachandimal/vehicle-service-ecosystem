import { useState, useEffect } from 'react';
import { vehicleApi } from '../api/vehicle.api';
import type { Vehicle } from '../api/vehicle.api';
import { bookingApi } from '../api/booking.api';
import type { BookingResponse } from '../api/booking.api';

export const useOwnerDashboard = () => {
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
  }, []);

  return {
    vehicles,
    bookings,
    loading,
    error,
    refreshData: fetchData
  };
};
