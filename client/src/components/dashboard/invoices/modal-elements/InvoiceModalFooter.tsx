import React from 'react';

interface Props {
    totalAmount: number;
    loading: boolean;
    itemCount: number;
    isEditMode: boolean;
    onClose: () => void;
}

export const InvoiceModalFooter: React.FC<Props> = ({ totalAmount, loading, itemCount, isEditMode, onClose }) => (
    <>
        <div className="mt-8 pt-5 border-t border-dashed border-gray-200 flex justify-between items-end">
            <span className="text-gray-500 font-medium text-sm">Total Amount</span>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                Rs. {totalAmount.toFixed(2)}
            </span>
        </div>

        <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-600 transition-colors">
                Cancel
            </button>
            <button type="submit" disabled={loading || itemCount === 0} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black font-medium disabled:opacity-50 transition-colors shadow-md">
                {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Confirm & Create')}
            </button>
        </div>
    </>
);
