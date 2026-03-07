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

/**
 * Send an email using the configured nodemailer transporter
 * @param to      - Recipient email address
 * @param subject - Email subject line
 * @param html    - HTML body of the email
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    await mailer.sendMail({
        from: `"AutoFix" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
}

export default mailer;
