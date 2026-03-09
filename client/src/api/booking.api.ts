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
};
