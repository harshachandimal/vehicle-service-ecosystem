import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Input component props
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Optional label text */
    label?: string;
    /** Optional error message to display */
    error?: string;
}

/**
 * Reusable input component with label and error display
 * @param props - Input component props
 * @param ref - Forwarded ref to the input element
 * @returns Input element with optional label and error message
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-dark mb-2">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        'w-full px-4 py-3 bg-white rounded-lg border transition-all outline-none',
                        error
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-200 focus:border-primary',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
