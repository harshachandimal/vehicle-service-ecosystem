export default function BookingNotes({
    notes,
    onNotesChange
}: {
    notes: string;
    onNotesChange: (notes: string) => void;
}) {
    return (
        <div className="space-y-3">
            <div className="font-semibold text-dark mb-2">Additional Notes (Optional)</div>
            <textarea
                rows={3}
                placeholder="Any specific issues or requests?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary/30 outline-none resize-none"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
            />
        </div>
    );
}
