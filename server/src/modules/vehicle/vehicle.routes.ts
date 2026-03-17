import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';
import { uploadPhoto } from '../../common/middleware/upload.middleware';
import { UserRole } from '../../types/user.types';
import {
    addVehicleHandler,
    getMyVehiclesHandler,
    getVehicleDetailsHandler,
    updateVehiclePhotoHandler,
    deleteVehicleHandler,
} from './vehicle.controller';

const vehicleRoutes = Router();

// Apply authentication to all vehicle routes
vehicleRoutes.use(authenticate);

/**
 * @route   POST /api/vehicles
 * @desc    Add a new vehicle
 * @access  Protected (Owner only)
 */
vehicleRoutes.post('/', authorize([UserRole.OWNER]), addVehicleHandler);

/**
 * @route   GET /api/vehicles/me
 * @desc    List owner's vehicles
 * @access  Protected (Owner only)
 */
vehicleRoutes.get('/me', authorize([UserRole.OWNER]), getMyVehiclesHandler);

/**
 * @route   GET /api/vehicles/:id
 * @desc    Get vehicle details
 * @access  Protected (Owner only)
 */
vehicleRoutes.get('/:id', authorize([UserRole.OWNER]), getVehicleDetailsHandler);

/**
 * @route   PATCH /api/vehicles/:id/photo
 * @desc    Update vehicle photo
 * @access  Protected (Owner only)
 */
vehicleRoutes.patch('/:id/photo', authorize([UserRole.OWNER]), uploadPhoto, updateVehiclePhotoHandler);

/**
 * @route   DELETE /api/vehicles/:id
 * @desc    Delete a vehicle
 * @access  Protected (Owner only)
 */
vehicleRoutes.delete('/:id', authorize([UserRole.OWNER]), deleteVehicleHandler);

export default vehicleRoutes;
