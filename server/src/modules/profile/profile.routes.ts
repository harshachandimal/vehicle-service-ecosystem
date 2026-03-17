import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import {
    getProfileHandler,
    updateProfileHandler,
    changePasswordHandler,
    uploadPhotoHandler,
} from './profile.controller';
import { uploadPhoto } from '../../common/middleware/upload.middleware';

const router = Router();

/**
 * Profile Routes
 * All routes are protected by the authenticate middleware
 */

// GET /api/profile - Get current user profile
router.get('/', authenticate, getProfileHandler);

// PATCH /api/profile - Update profile details
router.patch('/', authenticate, updateProfileHandler);

// PATCH /api/profile/password - Change password
router.patch('/password', authenticate, changePasswordHandler);

// POST /api/profile/photo - Upload profile photo
router.post('/photo', authenticate, uploadPhoto, uploadPhotoHandler);

export default router;
