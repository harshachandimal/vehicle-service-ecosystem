import { Router } from 'express';
import { submitContactForm } from './contact.controller';

/**
 * Contact Routes
 * Public endpoint — no authentication required
 *
 * @module contactRoutes
 */
const contactRoutes = Router();

/**
 * POST /api/contact
 * Submit a contact form message
 *
 * @access Public
 * @body { name, email, phone?, message }
 * @returns {ContactMessage} Saved contact record
 */
contactRoutes.post('/', submitContactForm);

export default contactRoutes;
