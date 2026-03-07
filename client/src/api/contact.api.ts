/**
 * Contact API module
 * Handles HTTP calls to the POST /api/contact endpoint
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface ContactFormPayload {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

/**
 * Submit a contact form message to the server
 * @throws {Error} on non-2xx response
 */
export async function submitContact(data: ContactFormPayload): Promise<void> {
    const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to send your message. Please try again.');
    }
}
