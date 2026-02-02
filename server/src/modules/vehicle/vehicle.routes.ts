import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';
import { UserRole } from '../../types/user.types';
import {
    addVehicleHandler,
    getMyVehiclesHandler,
    deleteVehicleHandler,
} from './vehicle.controller';

/**
 * Vehicle Routes
 * Defines endpoints for vehicle management
 * All routes require authentication
 */
const vehicleRoutes = Router();

// Apply authentication to all vehicle routes
vehicleRoutes.use(authenticate);

/**
 * POST /vehicles
 * Add a new vehicle (Owner only)
 * 
 * @body {CreateVehicleDTO} - make, model, year, licensePlate
 * @returns {Vehicle} - Created vehicle data
 */
vehicleRoutes.post('/', authorize([UserRole.OWNER]), addVehicleHandler);

/**
 * GET /vehicles
 * List all vehicles for the authenticated owner
 * 
 * @returns {Vehicle[]} - Array of owner's vehicles
 */
vehicleRoutes.get('/', authorize([UserRole.OWNER]), getMyVehiclesHandler);

/**
 * DELETE /vehicles/:id
 * Delete a vehicle by ID (Owner only)
 * 
 * @param {string} id - Vehicle ID to delete
 * @returns {object} - Success message
 */
vehicleRoutes.delete('/:id', authorize([UserRole.OWNER]), deleteVehicleHandler);

export default vehicleRoutes;
