import { PrismaClient, ServiceCategory } from '@prisma/client';
import { UserRepository } from '../user/user.repository';
import {
    RegisterCredentials,
    BusinessRegisterCredentials,
    LoginCredentials,
    AuthResponse,
} from '../../types/auth.types';
import { UserRole } from '../../types/user.types';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { generateToken } from '../../utils/jwt.util';
import { sendEmail } from '../../utils/mailer';
import crypto from 'crypto';

/**
 * Authentication Service
 * Handles business logic for user authentication
 */
export class AuthService {
    /**
     * @param {UserRepository} userRepository - The user repository for data access
     * @param {PrismaClient} prisma - The Prisma client for database operations
     */
    constructor(
        private userRepository: UserRepository,
        private prisma: PrismaClient
    ) {}

    /**
     * Register a new customer (OWNER role)
     * @param {RegisterCredentials} credentials - Registration data
     * @returns {Promise<AuthResponse>} Token and user data
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { email, password, name, role, phone, district, city } = credentials;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) throw new Error('User with this email already exists');

        if (role !== UserRole.OWNER && role !== UserRole.PROVIDER) {
            throw new Error('Invalid role. Must be OWNER or PROVIDER');
        }

        const hashedPassword = await hashPassword(password);
        const user = await this.userRepository.createUser({
            email, password: hashedPassword, name, role, phone, district, city,
        });

        return this.generateAuthResponse(user);
    }

    /**
     * Register a new service provider
     * Creates a User record and a linked ProviderProfile atomically.
     * @param {BusinessRegisterCredentials} credentials - Business registration data
     * @returns {Promise<AuthResponse>} Token and user data
     */
    async registerBusiness(credentials: BusinessRegisterCredentials): Promise<AuthResponse> {
        const {
            email, password, name, phone, district, city,
            businessName, category, streetAddress, businessDescription, registrationNumber,
        } = credentials;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) throw new Error('User with this email already exists');

        const hashedPassword = await hashPassword(password);

        // Wrap both inserts in a transaction so neither persists if the other fails
        const user = await this.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: UserRole.PROVIDER,
                    phone,
                    district,
                    city,
                },
            });

            await tx.providerProfile.create({
                data: {
                    userId: newUser.id,
                    businessName,
                    category: category as ServiceCategory,
                    streetAddress: streetAddress ?? '',
                    district: district ?? '',
                    city: city ?? '',
                    businessDescription,
                    registrationNumber,
                },
            });

            return newUser;
        });

        return this.generateAuthResponse(user);
    }

    /**
     * Login an existing user
     * @param {LoginCredentials} credentials - Login credentials
     * @returns {Promise<AuthResponse>} Token and user data
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { email, password } = credentials;

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('Invalid email or password');

        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) throw new Error('Invalid email or password');

        return this.generateAuthResponse(user);
    }

    /**
     * Helper to generate a standardized authentication response
     * @param {any} user - The user object from database
     * @returns {AuthResponse} Token and user data
     */
    private generateAuthResponse(user: any): AuthResponse {
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role as UserRole
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role as UserRole
            },
        };
    }

    /**
     * Generate a password reset token and send a reset link via email.
     * Always responds with the same message to prevent user enumeration.
     * @param {string} email - The user's email address
     * @returns {Promise<{ message: string }>}
     */
    async forgotPassword(email: string): Promise<{ message: string }> {
        const genericResponse = { message: 'If that email is registered, a reset link has been sent.' };
        const user = await this.userRepository.findByEmail(email);
        if (!user) return genericResponse;

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordResetToken: hashedToken, passwordResetExpires: expires },
        });

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetLink = `${clientUrl}/reset-password/${rawToken}`;

        await sendEmail(
            user.email,
            'Reset your AutoFix password',
            this.getPasswordResetEmailTemplate(user.name, resetLink)
        );

        return genericResponse;
    }

    /**
     * Get the HTML template for password reset email
     */
    private getPasswordResetEmailTemplate(userName: string, resetLink: string): string {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f97316;">Reset Your Password</h2>
                <p>Hi ${userName},</p>
                <p>We received a request to reset the password for your AutoFix account.</p>
                <p>Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetLink}"
                       style="background-color: #f97316; color: white; padding: 14px 28px;
                               border-radius: 8px; text-decoration: none; font-weight: bold;
                               display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="font-size: 13px; color: #666;">
                    If you did not request a password reset, you can safely ignore this email.
                    Your password will not change.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="font-size: 12px; color: #aaa;">AutoFix Vehicle Service Ecosystem</p>
            </div>
        `;
    }

    /**
     * Reset a user's password using a valid reset token
     * @param {string} token - The raw reset token from the URL
     * @param {string} newPassword - The new plain-text password
     * @returns {Promise<{ message: string }>}
     */
    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: { gt: new Date() },
            },
        });

        if (!user) throw new Error('Invalid or expired reset token');

        const hashedPassword = await hashPassword(newPassword);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        return { message: 'Password has been reset successfully.' };
    }
}
