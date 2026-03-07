import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import mailer from '../../utils/mailer';

const prisma = new PrismaClient();

/** Destination address for all contact form notifications */
const NOTIFY_EMAIL = 'info.autofixlk@gmail.com';

/**
 * Submit a contact form message
 * POST /api/contact (public)
 *
 * Saves the submission to the DB, then attempts to send an email.
 * If the email fails, the DB record is still returned with 201.
 *
 * @param {Request} req @param {Response} res
 */
export async function submitContactForm(req: Request, res: Response): Promise<void> {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        res.status(400).json({ error: 'name, email, and message are required' });
        return;
    }

    let saved;
    try {
        saved = await prisma.contactMessage.create({
            data: { name, email, phone: phone || null, message },
        });
    } catch (dbError) {
        console.error('Contact DB save failed:', dbError);
        res.status(500).json({ error: 'Failed to save your message. Please try again.' });
        return;
    }

    // Attempt email — failure is non-fatal
    try {
        await mailer.sendMail({
            from: `"AutoFix Contact" <${process.env.SMTP_USER}>`,
            to: NOTIFY_EMAIL,
            subject: `New Contact Message from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone ?? 'Not provided'}</p>
                <hr/>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br/>')}</p>
            `,
        });
    } catch (mailError) {
        console.error('Contact email failed (non-fatal):', mailError);
    }

    res.status(201).json(saved);
}
