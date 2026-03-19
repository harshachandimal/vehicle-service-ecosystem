import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges tailwind classes and handles conditional classes efficiently.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
