import { Response } from 'express';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { VehicleService } from './vehicle.service';
import { VehicleRepository } from './vehicle.repository';
import { CreateVehicleDTO } from '../../types/vehicle.types';

/** Instantiate dependencies following DIP */
const vehicleRepository = new VehicleRepository();
const vehicleService = new VehicleService(vehicleRepository);

/**
 * Handle adding a new vehicle
 * Protected: Owner only
 * 
 * @param {AuthenticatedRequest} req - Express request with authenticated user
 * @param {Response} res - Express response object
 */
export async function addVehicleHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const ownerId = req.user!.userId;
        const data: CreateVehicleDTO = req.body;

        const vehicle = await vehicleService.addVehicle(ownerId, data);
        res.status(201).json(vehicle);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add vehicle';
        res.status(400).json({ error: message });
    }
}

/**
 * Handle listing owner's vehicles
 * Protected: Authenticated users
 * 
 * @param {AuthenticatedRequest} req - Express request with authenticated user
 * @param {Response} res - Express response object
 */
export async function getMyVehiclesHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const ownerId = req.user!.userId;
        const vehicles = await vehicleService.getMyVehicles(ownerId);
        res.status(200).json(vehicles);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch vehicles';
        res.status(500).json({ error: message });
    }
}

/**
 * Handle deleting a vehicle
 * Protected: Owner only
 * 
 * @param {AuthenticatedRequest} req - Express request with authenticated user
 * @param {Response} res - Express response object
 */
export async function deleteVehicleHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const ownerId = req.user!.userId;
        const vehicleId = req.params.id;

        await vehicleService.deleteVehicle(vehicleId, ownerId);
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete vehicle';
        res.status(400).json({ error: message });
    }
}
