import { UserRepository } from '../user/user.repository';
import { RegisterCredentials, LoginCredentials, AuthResponse } from '../../types/auth.types';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { generateToken } from '../../utils/jwt.util';

/**
 * Authentication Service
 * Handles business logic for user authentication
 * Implements Dependency Inversion Principle by receiving repository via constructor
 */
export class AuthService {
    private userRepository: UserRepository;

    /**
     * Create a new AuthService instance
     * 
     * @param {UserRepository} userRepository - The user repository for data access
     */
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Register a new user
     * Validates role, checks for existing user, hashes password, and creates user
     * 
     * @param {RegisterCredentials} credentials - Registration data
     * @returns {Promise<AuthResponse>} Token and user data on success
     * @throws {Error} If email already exists or role is invalid
     */
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { email, password, name, role } = credentials;

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Validate role
        if (role !== 'OWNER' && role !== 'PROVIDER') {
            throw new Error('Invalid role. Must be OWNER or PROVIDER');
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        const user = await this.userRepository.createUser({
            email, password: hashedPassword, name, role,
        });

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email, role: user.role });

        return {
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }

    /**
     * Login an existing user
     * Validates credentials and returns token with user data
     * 
     * @param {LoginCredentials} credentials - Login credentials
     * @returns {Promise<AuthResponse>} Token and user data on success
     * @throws {Error} If credentials are invalid
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { email, password } = credentials;

        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email, role: user.role });

        return {
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }
}
