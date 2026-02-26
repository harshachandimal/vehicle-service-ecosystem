import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Authentication layout props
 */
interface AuthLayoutProps {
    /** Child components to render inside the layout */
    children: ReactNode;
    /** Page title */
    title: string;
    /** Optional subtitle */
    subtitle?: string;
}

/**
 * Authentication page layout with centered card design
 * @param props - AuthLayout component props
 * @returns Authentication layout component
 */
export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{
                backgroundImage: 'url(/Gemini_Generated_Image_vxxazavxxazavxxa.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <h1 className="text-4xl font-bold text-blue-600 mb-2 drop-shadow-lg">
                            Auto<span className="text-black">Fix</span>
                        </h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{title}</h2>
                    {subtitle && <p className="text-gray-200 drop-shadow">{subtitle}</p>}
                </div>

                <div className="glass rounded-2xl p-8 shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
