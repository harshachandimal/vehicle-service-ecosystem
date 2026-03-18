import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getServiceById } from '../api/services.api';
import type { ServiceListItem } from '../api/services.api';
import { vehicleApi } from '../api/vehicle.api';
import type { Vehicle } from '../api/vehicle.api';
import { bookingApi } from '../api/booking.api';

export function useCreateBooking(serviceId: string | undefined) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Data states
    const [service, setService] = useState<ServiceListItem | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    // UI state
    const [noVehiclesError, setNoVehiclesError] = useState(false);

    // Form states
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { returnTo: `/book/${serviceId}` } });
            return;
        }
        if (user.role !== 'OWNER') {
            setError('Only vehicle owners can make bookings.');
            setIsLoading(false);
            return;
        }

        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, serviceId, navigate]);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            const [svcData, vehiclesData] = await Promise.all([
                getServiceById(serviceId!),
                vehicleApi.getMyVehicles()
            ]);

            setService(svcData);
            setVehicles(vehiclesData);

            if (vehiclesData.length > 0) {
                setSelectedVehicleId(vehiclesData[0].id);
            } else {
                setNoVehiclesError(true);
            }
        } catch (err: any) {
            setError('Failed to load required data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedVehicleId) return setError('Please select a vehicle');
        if (!selectedDate) return setError('Please select a date');
        if (!selectedTimeSlot) return setError('Please select a time slot');
        if (!service) return setError('Service details missing');

        setIsSubmitting(true);
        setError('');

        try {
            await bookingApi.createBooking({
                vehicleId: selectedVehicleId,
                providerId: service.providerId,
                serviceId: service.id,
                timeSlot: selectedTimeSlot,
                serviceDate: new Date(selectedDate).toISOString(),
                description: notes || `Booking for ${service.name}`
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/services');
            }, 2500);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create booking.');
            setIsSubmitting(false);
        }
    };

    return {
        isLoading,
        isSubmitting,
        error,
        success,
        service,
        vehicles,
        noVehiclesError,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedDate,
        setSelectedDate,
        selectedTimeSlot,
        setSelectedTimeSlot,
        notes,
        setNotes,
        handleSubmit
    };
}
