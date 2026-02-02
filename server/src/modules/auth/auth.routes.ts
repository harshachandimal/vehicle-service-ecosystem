import { Router } from 'express';
import { registerHandler, loginHandler } from './auth.controller';

/**
 * Authentication Routes
 * Defines endpoints for user authentication
 */
const authRoutes = Router();

/**
 * POST /auth/register
 * Register a new user
 * 
 * @body {RegisterCredentials} - email, password, name, role
 * @returns {AuthResponse} - token and user data
 */
authRoutes.post('/register', registerHandler);

/**
 * POST /auth/login
 * Login an existing user
 * 
 * @body {LoginCredentials} - email, password
 * @returns {AuthResponse} - token and user data
 */
authRoutes.post('/login', loginHandler);

export default authRoutes;
