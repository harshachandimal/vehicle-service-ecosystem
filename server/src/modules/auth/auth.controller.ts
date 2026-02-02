import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { RegisterCredentials, LoginCredentials } from '../../types/auth.types';

/** Instantiate dependencies following DIP */
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

/**
 * Handle user registration
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export async function registerHandler(req: Request, res: Response): Promise<void> {
    try {
        const credentials: RegisterCredentials = req.body;

        // Validate required fields
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
 * Handle user login
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
export async function loginHandler(req: Request, res: Response): Promise<void> {
    try {
        const credentials: LoginCredentials = req.body;

        // Validate required fields
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
