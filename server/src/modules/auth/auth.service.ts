import { PrismaService } from '../../common/prisma.service';
import { UserRepository } from '../user/user.repository';
import {
    RegisterCredentials,
    BusinessRegisterCredentials,
    LoginCredentials,
    AuthResponse,
} from '../../types/auth.types';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { generateToken } from '../../utils/jwt.util';
import { ServiceCategory } from '@prisma/client';
import crypto from 'crypto';

/**
 * Authentication Service
 * Handles business logic for user authentication
 */
export class AuthService {
    private userRepository: UserRepository;
    private prisma = PrismaService.getInstance();

    /**
     * @param {UserRepository} userRepository - The user repository for data access
     */
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Register a new customer (OWNER role)
     * @param {RegisterCredentials} credentials - Registration data
     * @returns {Promise<AuthResponse>} Token and user data
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { email, password, name, role, phone, district, city } = credentials;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) throw new Error('User with this email already exists');

        if (role !== 'OWNER' && role !== 'PROVIDER') {
            throw new Error('Invalid role. Must be OWNER or PROVIDER');
        }

        const hashedPassword = await hashPassword(password);
        const user = await this.userRepository.createUser({
            email, password: hashedPassword, name, role, phone, district, city,
        });

        const token = generateToken({ userId: user.id, email: user.email, role: user.role });
        return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role as any } };
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
                    role: 'PROVIDER',
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

        const token = generateToken({ userId: user.id, email: user.email, role: user.role as any });
        return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role as any } };
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

        const token = generateToken({ userId: user.id, email: user.email, role: user.role });
        return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    }

    /**
     * Generate a password reset token for a given email
     * Always responds successfully to prevent user enumeration
     * @param {string} email - The user's email address
     * @returns {Promise<{ message: string; resetToken?: string }>}
     */
    async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) return { message: 'If that email is registered, a reset link has been sent.' };

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordResetToken: hashedToken, passwordResetExpires: expires },
        });

        return {
            message: 'If that email is registered, a reset link has been sent.',
            resetToken: rawToken,
        };
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
