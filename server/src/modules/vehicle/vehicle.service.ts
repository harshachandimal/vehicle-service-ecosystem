import { VehicleRepository } from './vehicle.repository';
import { Vehicle, CreateVehicleDTO } from '../../types/vehicle.types';

/**
 * Vehicle Service
 * Handles business logic for vehicle management
 * Implements Dependency Inversion Principle by receiving repository via constructor
 */
export class VehicleService {
    private vehicleRepository: VehicleRepository;

    /**
     * Create a new VehicleService instance
     * 
     * @param {VehicleRepository} vehicleRepository - The vehicle repository for data access
     */
    constructor(vehicleRepository: VehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    /**
     * Add a new vehicle for an owner
     * Validates input data before creating
     * 
     * @param {string} ownerId - The authenticated owner's ID
     * @param {CreateVehicleDTO} data - Vehicle data to create
     * @returns {Promise<Vehicle>} The created vehicle
     * @throws {Error} If validation fails
     */
    async addVehicle(ownerId: string, data: CreateVehicleDTO): Promise<Vehicle> {
        // Validate required fields
        if (!data.make || !data.model || !data.year || !data.licensePlate) {
            throw new Error('All vehicle fields are required');
        }

        // Validate year is reasonable
        const currentYear = new Date().getFullYear();
        if (data.year < 1900 || data.year > currentYear + 1) {
            throw new Error('Invalid vehicle year');
        }

        return this.vehicleRepository.create(ownerId, data);
    }

    /**
     * Get all vehicles for an owner
     * 
     * @param {string} ownerId - The authenticated owner's ID
     * @returns {Promise<Vehicle[]>} Array of owner's vehicles
     */
    async getMyVehicles(ownerId: string): Promise<Vehicle[]> {
        return this.vehicleRepository.findAllByOwner(ownerId);
    }

    /**
     * Delete a vehicle (only if owned by the user)
     * 
     * @param {string} vehicleId - The vehicle ID to delete
     * @param {string} ownerId - The authenticated owner's ID
     * @returns {Promise<boolean>} True if deleted successfully
     * @throws {Error} If vehicle not found or not owned by user
     */
    async deleteVehicle(vehicleId: string, ownerId: string): Promise<boolean> {
        const deleted = await this.vehicleRepository.deleteById(vehicleId, ownerId);
        if (!deleted) {
            throw new Error('Vehicle not found or access denied');
        }
        return true;
    }
}
