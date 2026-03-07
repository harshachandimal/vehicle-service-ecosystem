import nodemailer from 'nodemailer';

/**
 * Nodemailer transporter instance
 * Configured via SMTP_USER and SMTP_PASS environment variables (Gmail)
 */
const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export default mailer;
