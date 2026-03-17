import { Request, Response } from 'express';
import { PrismaService } from '../../common/prisma.service';
import { hashPassword, comparePassword } from '../../utils/password.util';

const prisma = PrismaService.getInstance();

/**
 * Get current user profile data
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export async function getProfileHandler(req: Request, res: Response): Promise<void> {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                district: true,
                city: true,
                createdAt: true,
                providerProfile: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
}

/**
 * Update current user profile data
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export async function updateProfileHandler(req: Request, res: Response): Promise<void> {
    try {
        const userId = (req as any).user?.userId;
        const role = (req as any).user?.role;
        const {
            name, phone, district, city,
            businessName, category, streetAddress, businessDescription, registrationNumber
        } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Use transaction to ensure both user and provider profile are updated together
        await prisma.$transaction(async (tx) => {
            // Update basic user info
            await tx.user.update({
                where: { id: userId },
                data: { name, phone, district, city },
            });

            // Update provider profile if applicable
            if (role === 'PROVIDER') {
                await tx.providerProfile.update({
                    where: { userId },
                    data: {
                        businessName,
                        category,
                        streetAddress,
                        businessDescription,
                        registrationNumber,
                    },
                });
            }
        });

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
}

/**
 * Change user password
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export async function changePasswordHandler(req: Request, res: Response): Promise<void> {
    try {
        const userId = (req as any).user?.userId;
        const { currentPassword, newPassword } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'Current and new password are required' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) {
            res.status(400).json({ error: 'Invalid current password' });
            return;
        }

        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
}

/**
 * Upload and update provider profile photo
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export async function uploadPhotoHandler(req: Request, res: Response): Promise<void> {
    try {
        const userId = (req as any).user?.userId;
        const role = (req as any).user?.role;
        const file = req.file;

        if (!userId || role !== 'PROVIDER') {
            res.status(403).json({ error: 'Only providers can upload profile photos' });
            return;
        }

        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const photoUrl = `/uploads/${file.filename}`;

        await prisma.providerProfile.update({
            where: { userId },
            data: { photoUrl },
        });

        res.status(200).json({ 
            message: 'Photo uploaded successfully',
            photoUrl 
        });
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ error: 'Failed to upload photo' });
    }
}
