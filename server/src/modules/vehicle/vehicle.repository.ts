import { PrismaService } from '../../common/prisma.service';
import { Vehicle, CreateVehicleDTO } from '../../types/vehicle.types';

/**
 * Vehicle Repository
 * Handles all database operations for Vehicle entities
 * Implements the Repository Pattern for data access abstraction
 */
export class VehicleRepository {
    private prisma = PrismaService.getInstance();

    /**
     * Create a new vehicle in the database
     * 
     * @param {string} ownerId - The ID of the owner creating the vehicle
     * @param {CreateVehicleDTO} data - The vehicle data to create
     * @returns {Promise<Vehicle>} The created vehicle
     */
    async create(ownerId: string, data: CreateVehicleDTO): Promise<Vehicle> {
        const vehicle = await this.prisma.vehicle.create({
            data: {
                ownerId,
                make: data.make,
                model: data.model,
                year: data.year,
                licensePlate: data.licensePlate,
            },
        });
        return this.mapToVehicle(vehicle);
    }

    /**
     * Find all vehicles owned by a specific user
     * 
     * @param {string} ownerId - The owner's user ID
     * @returns {Promise<Vehicle[]>} Array of vehicles owned by the user
     */
    async findAllByOwner(ownerId: string): Promise<Vehicle[]> {
        const vehicles = await this.prisma.vehicle.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' },
        });
        return vehicles.map(v => this.mapToVehicle(v));
    }

    /**
     * Find a vehicle by ID
     * 
     * @param {string} id - The vehicle ID
     * @returns {Promise<Vehicle | null>} The vehicle or null if not found
     */
    async findById(id: string): Promise<Vehicle | null> {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) return null;
        return this.mapToVehicle(vehicle);
    }

    /**
     * Update a vehicle's information
     * 
     * @param {string} id - The vehicle ID
     * @param {UpdateVehicleDTO} data - The data to update
     * @returns {Promise<Vehicle>} The updated vehicle
     */
    async update(id: string, data: any): Promise<Vehicle> {
        const vehicle = await this.prisma.vehicle.update({
            where: { id },
            data,
        });
        return this.mapToVehicle(vehicle);
    }

    /**
     * Delete a vehicle by ID (only if owned by the specified user)
     * 
     * @param {string} id - The vehicle ID to delete
     * @param {string} ownerId - The owner's user ID
     * @returns {Promise<boolean>} True if deleted, false if not found or not owned
     */
    async deleteById(id: string, ownerId: string): Promise<boolean> {
        const result = await this.prisma.vehicle.deleteMany({
            where: { id, ownerId },
        });
        return result.count > 0;
    }

    /**
     * Map Prisma vehicle to domain Vehicle
     */
    private mapToVehicle(prismaVehicle: any): Vehicle {
        return {
            id: prismaVehicle.id,
            ownerId: prismaVehicle.ownerId,
            make: prismaVehicle.make,
            model: prismaVehicle.model,
            year: prismaVehicle.year,
            licensePlate: prismaVehicle.licensePlate,
            photoUrl: prismaVehicle.photoUrl,
            createdAt: prismaVehicle.createdAt,
            updatedAt: prismaVehicle.updatedAt,
        };
    }
}
