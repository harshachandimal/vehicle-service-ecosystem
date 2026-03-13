import { useState, useEffect } from 'react';
import { invoiceApi, type InvoiceItem } from '../api/invoice.api';

const EMPTY_ITEM: InvoiceItem = { description: '', price: 0, quantity: 1 };

interface UseInvoiceFormOptions {
    isOpen: boolean;
    bookingId: string;
    invoiceId?: string;
    onSuccess: () => void;
    onClose: () => void;
}

export function useInvoiceForm({ isOpen, bookingId, invoiceId, onSuccess, onClose }: UseInvoiceFormOptions) {
    const [items, setItems] = useState<InvoiceItem[]>([{ ...EMPTY_ITEM }]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (isOpen && invoiceId) {
            const fetchExisting = async () => {
                try {
                    setFetching(true);
                    const invoice = await invoiceApi.getInvoice(bookingId);
                    if (invoice.items && invoice.items.length > 0) {
                        setItems(invoice.items);
                    }
                } catch (e) {
                    console.error('Failed to fetch invoice details', e);
                } finally {
                    setFetching(false);
                }
            };
            fetchExisting();
        } else if (isOpen && !invoiceId) {
            setItems([{ ...EMPTY_ITEM }]);
        }
    }, [isOpen, invoiceId, bookingId]);

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const addItem = () => setItems([...items, { ...EMPTY_ITEM }]);

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (invoiceId) {
                await invoiceApi.updateInvoice(invoiceId, { bookingId, items });
            } else {
                await invoiceApi.createInvoice({ bookingId, items });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save invoice', error);
            alert('Failed to save invoice');
        } finally {
            setLoading(false);
        }
    };

    return { items, loading, fetching, totalAmount, addItem, removeItem, updateItem, handleSubmit, isEditMode: !!invoiceId };
}
