/**
 * Multer upload middleware
 * Handles multipart/form-data file uploads for provider profile photos
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';

/** Ensure uploads directory exists */
const UPLOAD_DIR = path.join(__dirname, '../../../public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/** Disk storage — saves file with timestamp-prefixed original name */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
});

/** Only accept jpeg / png / webp images up to 5 MB */
export const uploadPhoto = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, allowed.includes(file.mimetype));
    },
}).single('photo');
