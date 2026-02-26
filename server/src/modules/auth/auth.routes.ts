import { Router } from 'express';
import { registerHandler, registerBusinessHandler, loginHandler } from './auth.controller';

/**
 * Authentication Routes
 * Defines endpoints for user authentication
 */
const authRoutes = Router();

/**
 * POST /auth/register
 * Register a new customer (OWNER role)
 * @body {RegisterCredentials} - email, password, name, role
 */
authRoutes.post('/register', registerHandler);

/**
 * POST /auth/register-business
 * Register a new service provider (creates User + ProviderProfile atomically)
 * @body {BusinessRegisterCredentials} - email, password, name, businessName, category, ...
 */
authRoutes.post('/register-business', registerBusinessHandler);

/**
 * POST /auth/login
 * Login an existing user
 * @body {LoginCredentials} - email, password
 */
authRoutes.post('/login', loginHandler);

export default authRoutes;
