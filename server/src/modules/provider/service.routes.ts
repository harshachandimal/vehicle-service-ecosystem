/**
 * Service Routes
 * Public API routes for the service listing page
 */

import { Router } from 'express';
import { getAvailableServicesHandler, getServiceByIdHandler } from './provider.controller';

const serviceRoutes = Router();

/**
 * GET /api/services
 * List all provider services with optional filtering (Public)
 *
 * @query {string}  vehicleType  - Car | Van | Truck | SUV | Sports Car
 * @query {string}  location     - City or district (partial match)
 * @query {number}  minRating    - Minimum rating (e.g. 4)
 * @query {number}  maxPrice     - Maximum price in LKR
 * @query {number}  maxDuration  - Maximum duration in minutes
 * @query {string}  search       - Service name search
 * @returns {ServiceListItem[]}  - Array of matching services with provider info
 */
serviceRoutes.get('/', getAvailableServicesHandler);

/**
 * GET /api/services/:id
 * Get a specific service by ID (Public)
 */
serviceRoutes.get('/:id', getServiceByIdHandler);

export default serviceRoutes;
