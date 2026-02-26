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
}
