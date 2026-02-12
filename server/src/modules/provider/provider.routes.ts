/**
 * Provider Routes
 * API routes for Provider Profile and Service management
 * All write routes require authentication and PROVIDER role
 */

import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth.middleware';
import { UserRole } from '../../types/user.types';
import {
    updateProfileHandler,
    addServiceHandler,
    removeServiceHandler,
    getMyProfileHandler,
    getProviderByIdHandler,
} from './provider.controller';

const providerRoutes = Router();

/**
 * PUT /api/providers/profile
 * Update provider business profile
 * Protected: PROVIDER only
 * 
 * @body {UpdateProviderProfileDTO} - businessName, category, phone, address
 * @returns {ProviderProfile} - Updated profile data
 */
providerRoutes.put(
    '/profile',
    authenticate,
    authorize([UserRole.PROVIDER]),
    updateProfileHandler
);

/**
 * POST /api/providers/services
 * Add service item to provider's catalog
 * Protected: PROVIDER only
 * 
 * @body {CreateServiceItemDTO} - name, price, description
 * @returns {ProviderService} - Created service item
 */
providerRoutes.post(
    '/services',
    authenticate,
    authorize([UserRole.PROVIDER]),
    addServiceHandler
);

/**
 * DELETE /api/providers/services/:id
 * Remove service item from catalog
 * Protected: PROVIDER only
 * 
 * @param {string} id - Service ID to delete
 * @returns 204 No Content
 */
providerRoutes.delete(
    '/services/:id',
    authenticate,
    authorize([UserRole.PROVIDER]),
    removeServiceHandler
);

/**
 * GET /api/providers/me
 * Get current provider's profile and services
 * Protected: PROVIDER only
 * 
 * @returns {ProviderDetailsResponse} - Profile with services
 */
providerRoutes.get(
    '/me',
    authenticate,
    authorize([UserRole.PROVIDER]),
    getMyProfileHandler
);

/**
 * GET /api/providers/:id
 * Get provider details with service menu (Public)
 * No authentication required
 * 
 * @param {string} id - Provider profile ID
 * @returns {ProviderDetailsResponse} - Provider profile and services
 */
providerRoutes.get('/:id', getProviderByIdHandler);

export default providerRoutes;
