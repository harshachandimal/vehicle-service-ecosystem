/**
 * Provider Controller
 * HTTP request handlers for Provider Profile and Service endpoints
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { ProviderService } from './provider.service';
import { ProviderRepository } from './provider.repository';
import {
    UpdateProviderProfileDTO,
    CreateServiceItemDTO,
    ProviderFilterDTO,
    ServiceFilterDTO,
} from '../../types/provider.types';



/** Instantiate dependencies following DIP */
const providerRepository = new ProviderRepository();
const providerService = new ProviderService(providerRepository);

/**
 * GET /api/providers
 * List all providers with optional filtering (Public)
 */
export async function getAllProvidersHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const filters: ProviderFilterDTO = {
            location: req.query.location as string | undefined,
            search: req.query.search as string | undefined,
            type: req.query.type as ProviderFilterDTO['type'],
            minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
        };
        const providers = await providerService.getAllProviders(filters);
        res.status(200).json(providers);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch providers';
        res.status(500).json({ error: message });
    }
}

/**
 * POST /api/providers/photo
 * Upload or replace the provider's profile photo
 * Protected: PROVIDER only
 */
export async function uploadPhotoHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const userId = req.user!.userId;
        if (!req.file) {
            res.status(400).json({ error: 'No image file provided' });
            return;
        }
        const photoUrl = `/uploads/${req.file.filename}`;
        const profile = await providerService.updateProfile(userId, { photoUrl });
        res.status(200).json({ photoUrl, profile });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed';
        res.status(500).json({ error: message });
    }
}

/**
 * PUT /api/providers/profile
 * Update provider business profile
 * Protected: PROVIDER only
 */
export async function updateProfileHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const data: UpdateProviderProfileDTO = req.body;

        const profile = await providerService.updateProfile(userId, data);
        res.status(200).json(profile);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update profile';
        res.status(400).json({ error: message });
    }
}

/**
 * POST /api/providers/services
 * Add service item to provider's catalog
 * Protected: PROVIDER only
 */
export async function addServiceHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const data: CreateServiceItemDTO = req.body;

        const service = await providerService.addServiceToMenu(userId, data);
        res.status(201).json(service);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add service';
        res.status(400).json({ error: message });
    }
}

/**
 * DELETE /api/providers/services/:id
 * Remove service item from catalog
 * Protected: PROVIDER only
 */
export async function removeServiceHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const serviceId = req.params.id;
        await providerService.removeServiceFromMenu(serviceId);
        res.status(204).send();
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to remove service';
        res.status(400).json({ error: message });
    }
}

/**
 * GET /api/providers/:id
 * Get provider details with service menu (Public)
 */
export async function getProviderByIdHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const profileId = req.params.id;
        const details = await providerService.getProviderDetailsById(profileId);

        if (!details) {
            res.status(404).json({ error: 'Provider not found' });
            return;
        }

        res.status(200).json(details);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch provider';
        res.status(500).json({ error: message });
    }
}

/**
 * GET /api/providers/me
 * Get current provider's details
 * Protected: PROVIDER only
 */
export async function getMyProfileHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const userId = req.user!.userId;
        const details = await providerService.getProviderDetails(userId);

        if (!details) {
            res.status(404).json({ error: 'Provider profile not found' });
            return;
        }

        res.status(200).json(details);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch profile';
        res.status(500).json({ error: message });
    }
}

/**
 * GET /api/services
 * List all available services with optional filtering (Public)
 */
export async function getAvailableServicesHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const filters: ServiceFilterDTO = {
            vehicleType: req.query.vehicleType as string | undefined,
            location: req.query.location as string | undefined,
            minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
            maxDuration: req.query.maxDuration ? parseInt(req.query.maxDuration as string) : undefined,
            search: req.query.search as string | undefined,
        };
        const services = await providerService.getAvailableServices(filters);
        res.status(200).json(services);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch services';
        res.status(500).json({ error: message });
    }
}

/**
 * GET /api/services/:id
 * Get a specific service by ID (Public)
 */
export async function getServiceByIdHandler(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const serviceId = req.params.id;
        const service = await providerService.getServiceById(serviceId);

        if (!service) {
            res.status(404).json({ error: 'Service not found' });
            return;
        }

        res.status(200).json(service);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch service details';
        res.status(500).json({ error: message });
    }
}
