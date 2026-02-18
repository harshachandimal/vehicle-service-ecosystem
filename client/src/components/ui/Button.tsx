import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * Button component props
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button visual variant style */
    variant?: 'primary' | 'secondary' | 'outline';
    /** Button content */
    children: ReactNode;
    /** Loading state indicator */
    loading?: boolean;
}

/**
 * Reusable button component with multiple variants and loading state
 * @param props - Button component props
 * @returns Button element
 */
export default function Button({
    variant = 'primary',
    children,
    loading,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={clsx(
                'px-6 py-3 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
                variant === 'primary' && 'btn-primary',
                variant === 'secondary' && 'btn-secondary',
                variant === 'outline' && 'border-2 border-gray-300 hover:border-primary hover:text-primary',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
}
