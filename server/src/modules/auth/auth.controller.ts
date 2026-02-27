import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { RegisterCredentials, BusinessRegisterCredentials, LoginCredentials } from '../../types/auth.types';

/** Instantiate dependencies following DIP */
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

/**
 * Handle customer registration (creates User only)
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export async function registerHandler(req: Request, res: Response): Promise<void> {
    try {
        const credentials: RegisterCredentials = req.body;

        if (!credentials.email || !credentials.password || !credentials.name || !credentials.role) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const result = await authService.register(credentials);
        res.status(201).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        res.status(400).json({ error: message });
    }
}

/**
 * Handle business registration (creates User + ProviderProfile atomically)
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export async function registerBusinessHandler(req: Request, res: Response): Promise<void> {
    try {
        const credentials: BusinessRegisterCredentials = req.body;

        if (!credentials.email || !credentials.password || !credentials.name
            || !credentials.businessName || !credentials.category) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const result = await authService.registerBusiness(credentials);
        res.status(201).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        res.status(400).json({ error: message });
    }
}

/**
 * Handle user login
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export async function loginHandler(req: Request, res: Response): Promise<void> {
    try {
        const credentials: LoginCredentials = req.body;

        if (!credentials.email || !credentials.password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const result = await authService.login(credentials);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        res.status(401).json({ error: message });
    }
}

/**
 * Handle forgot password — generates a reset token
 * @param {Request} req - Express request with { email } body
 * @param {Response} res - Express response
 */
export async function forgotPasswordHandler(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.body;
        if (!email) { res.status(400).json({ error: 'Email is required' }); return; }
        const result = await authService.forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Request failed';
        res.status(400).json({ error: message });
    }
}

/**
 * Handle password reset using a valid token
 * @param {Request} req - Express request with { token, newPassword } body
 * @param {Response} res - Express response
 */
export async function resetPasswordHandler(req: Request, res: Response): Promise<void> {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) { res.status(400).json({ error: 'Token and newPassword are required' }); return; }
        const result = await authService.resetPassword(token, newPassword);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Reset failed';
        res.status(400).json({ error: message });
    }
}

