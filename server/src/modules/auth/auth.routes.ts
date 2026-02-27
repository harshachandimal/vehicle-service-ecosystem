import { Router } from 'express';
import {
    registerHandler,
    registerBusinessHandler,
    loginHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
} from './auth.controller';

/**
 * Authentication Routes
 * Defines endpoints for user authentication
 */
const authRoutes = Router();

/** POST /auth/register — Register a new customer (OWNER role) */
authRoutes.post('/register', registerHandler);

/** POST /auth/register-business — Register a new service provider */
authRoutes.post('/register-business', registerBusinessHandler);

/** POST /auth/login — Login an existing user */
authRoutes.post('/login', loginHandler);

/** POST /auth/forgot-password — Generate a password reset token */
authRoutes.post('/forgot-password', forgotPasswordHandler);

/** POST /auth/reset-password — Reset password using a valid token */
authRoutes.post('/reset-password', resetPasswordHandler);

export default authRoutes;

