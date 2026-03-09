import api from './auth.api';

export interface Vehicle {
    id: string;
    ownerId: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVehicleDTO {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
}

export const vehicleApi = {
    /**
     * Add a new vehicle for the authenticated owner
     * @param data - The vehicle details
     */
    addVehicle: async (data: CreateVehicleDTO): Promise<Vehicle> => {
        const response = await api.post<Vehicle>('/api/vehicles', data);
        return response.data;
    },

    /**
     * Get all vehicles belonging to the authenticated owner
     */
    getMyVehicles: async (): Promise<Vehicle[]> => {
        const response = await api.get<Vehicle[]>('/api/vehicles');
        return response.data;
    },
};
