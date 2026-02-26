import { PrismaService } from '../../common/prisma.service';
import { User, CreateUserDTO, UserRole } from '../../types/user.types';
import { UserRole as PrismaUserRole } from '@prisma/client';

/**
 * User Repository
 * Handles all database operations for User entities
 * Implements the Repository Pattern for data access abstraction
 */
export class UserRepository {
    private prisma = PrismaService.getInstance();

    /**
     * Find a user by their email address
     * 
     * @param {string} email - The email address to search for
     * @returns {Promise<(User & { password: string }) | null>} User with password if found
     */
    async findByEmail(email: string): Promise<(User & { password: string }) | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user ? this.mapToUser(user) : null;
    }

    /**
     * Find a user by their unique identifier
     * 
     * @param {string} id - The user's unique identifier
     * @returns {Promise<User | null>} User if found, null otherwise
     */
    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? this.mapToUserWithoutPassword(user) : null;
    }

    /**
     * Create a new user in the database
     * 
     * @param {CreateUserDTO} data - The user data to create
     * @returns {Promise<User>} The created user without password
     */
    async createUser(data: CreateUserDTO): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
                role: data.role as PrismaUserRole,
                phone: data.phone,
                district: data.district,
                city: data.city,
            },
        });
        return this.mapToUserWithoutPassword(user);
    }

    /**
     * Map Prisma user to domain User with password
     */
    private mapToUser(prismaUser: any): User & { password: string } {
        return {
            id: prismaUser.id,
            email: prismaUser.email,
            password: prismaUser.password,
            name: prismaUser.name,
            role: prismaUser.role as UserRole,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        };
    }

    /**
     * Map Prisma user to domain User without password
     */
    private mapToUserWithoutPassword(prismaUser: any): User {
        return {
            id: prismaUser.id,
            email: prismaUser.email,
            name: prismaUser.name,
            role: prismaUser.role as UserRole,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        };
    }
}
