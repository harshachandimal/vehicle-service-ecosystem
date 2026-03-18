import api from './auth.api';

export interface InvoiceItem {
    description: string;
    price: number;
    quantity: number;
}

export interface CreateInvoiceData {
    bookingId: string;
    items: InvoiceItem[];
}

export interface Invoice {
    id: string;
    bookingId: string;
    amount: number;
    status: 'DRAFT' | 'UNPAID' | 'PAYMENT_PENDING' | 'PAID';
    items: InvoiceItem[];
    createdAt: string;
    updatedAt: string;
    booking?: any;
    vehicle?: any;
    provider?: any;
}

export const invoiceApi = {
    /**
     * Create a new invoice
     */
    createInvoice: async (data: CreateInvoiceData): Promise<Invoice> => {
        const response = await api.post<Invoice>('/api/invoices', data);
        return response.data;
    },

    /**
     * Update an existing draft invoice
     */
    updateInvoice: async (id: string, data: CreateInvoiceData): Promise<Invoice> => {
        const response = await api.put<Invoice>(`/api/invoices/${id}`, data);
        return response.data;
    },

    /**
     * Finalize an invoice so it can no longer be edited
     */
    finalizeInvoice: async (id: string): Promise<Invoice> => {
        const response = await api.patch<Invoice>(`/api/invoices/${id}/finalize`);
        return response.data;
    },

    /**
     * Get invoice by booking ID
     */
    getInvoice: async (bookingId: string): Promise<Invoice> => {
        const response = await api.get<Invoice>(`/api/invoices/booking/${bookingId}`);
        return response.data;
    },

    /**
     * Pay an invoice
     */
    payInvoice: async (id: string): Promise<Invoice> => {
        const response = await api.patch<Invoice>(`/api/invoices/${id}/pay`);
        return response.data;
    },

    /**
     * Confirm a payment has been received (Provider ONLY)
     */
    confirmPayment: async (id: string): Promise<Invoice> => {
        const response = await api.patch<Invoice>(`/api/invoices/${id}/confirm`);
        return response.data;
    },
};
