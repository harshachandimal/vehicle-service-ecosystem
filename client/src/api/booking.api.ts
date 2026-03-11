import api from './auth.api';

export interface CreateBookingDTO {
    vehicleId: string;
    providerId: string;
    serviceId?: string;
    timeSlot?: string;
    description: string;
    serviceDate: string; // ISO date string
}

export interface BookingResponse {
    id: string;
    vehicleId: string;
    providerId: string;
    serviceId?: string;
    timeSlot?: string;
    description: string;
    serviceDate: string;
    status: string;
    vehicle?: {
        make: string;
        model: string;
        licensePlate: string;
        ownerName?: string;
        ownerPhone?: string;
    };
    service?: {
        name: string;
        price: string;
    };
    provider?: {
        name: string;
        email: string;
    };
}

export const bookingApi = {
    /**
     * Create a new booking
     * @param data - The booking payload
     */
    createBooking: async (data: CreateBookingDTO): Promise<BookingResponse> => {
        const response = await api.post<BookingResponse>('/api/bookings', data);
        return response.data;
    },

    /**
     * Get all bookings for the authenticated provider
     */
    getProviderBookings: async (): Promise<BookingResponse[]> => {
        const response = await api.get<BookingResponse[]>('/api/bookings/provider');
        return response.data;
    },

    /**
     * Update the status of a booking
     * @param id - Booking ID
     * @param status - New status (e.g. ACCEPTED, REJECTED, COMPLETED)
     */
    updateBookingStatus: async (id: string, status: string): Promise<BookingResponse> => {
        const response = await api.patch<BookingResponse>(`/api/bookings/${id}/status`, { status });
        return response.data;
    },
};
