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
        id: string;
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        ownerName?: string;
        ownerPhone?: string;
    };
    service?: {
        id: string;
        name: string;
        price: string;
    };
    provider?: {
        name: string;
        email: string;
    };
    invoice?: {
        id: string;
        status: string;
        amount?: string;
    };
    currentMileage?: number | null;
    serviceNote?: string | null;
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
     * Get all bookings for the authenticated owner
     */
    getMyBookings: async (): Promise<BookingResponse[]> => {
        const response = await api.get<BookingResponse[]>('/api/bookings/me');
        return response.data;
    },

    /**
     * Get a specific booking by ID
     * @param id - Booking ID
     */
    getBookingById: async (id: string): Promise<BookingResponse> => {
        const response = await api.get<BookingResponse>(`/api/bookings/${id}`);
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

    /**
     * Update the service record (mileage + note) for a completed booking (Provider only)
     * @param id - Booking ID
     * @param currentMileage - Vehicle mileage at time of service
     * @param serviceNote - Optional short description of work done
     */
    updateServiceRecord: async (id: string, currentMileage: number, serviceNote?: string): Promise<BookingResponse> => {
        const response = await api.patch<BookingResponse>(`/api/bookings/${id}/service-record`, { currentMileage, serviceNote });
        return response.data;
    },
};
