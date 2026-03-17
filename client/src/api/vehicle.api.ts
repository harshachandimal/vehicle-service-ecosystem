import api from './auth.api';

export interface Vehicle {
    id: string;
    ownerId: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    photoUrl?: string;
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
        const response = await api.get<Vehicle[]>('/api/vehicles/me');
        return response.data;
    },

    /**
     * Get a single vehicle by ID
     */
    getVehicleById: async (id: string): Promise<Vehicle> => {
        const response = await api.get<Vehicle>(`/api/vehicles/${id}`);
        return response.data;
    },

    /**
     * Update vehicle photo
     */
    uploadVehiclePhoto: async (id: string, file: File): Promise<Vehicle> => {
        const formData = new FormData();
        formData.append('photo', file);

        const response = await api.patch<Vehicle>(`/api/vehicles/${id}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
