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
} from '../../types/provider.types';

/** Instantiate dependencies following DIP */
const providerRepository = new ProviderRepository();
const providerService = new ProviderService(providerRepository);

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
