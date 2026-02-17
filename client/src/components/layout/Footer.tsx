import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-primary">AutoFix</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Sri Lanka's premier vehicle service platform connecting owners with verified professionals.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Services</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/services/browse" className="hover:text-primary transition">Browse Services</Link></li>
                        <li><Link to="/services/providers" className="hover:text-primary transition">Find Providers</Link></li>
                        <li><Link to="/services/book" className="hover:text-primary transition">Book Service</Link></li>
                        <li><Link to="/services/repairs" className="hover:text-primary transition">Repairs</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-primary transition">Contact Us</Link></li>
                        <li><Link to="/careers" className="hover:text-primary transition">Careers</Link></li>
                        <li><Link to="/blog" className="hover:text-primary transition">Blog</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Legal & Support</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/terms" className="hover:text-primary transition">Terms & Conditions</Link></li>
                        <li><Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
                        <li><Link to="/help" className="hover:text-primary transition">Help Center</Link></li>
                        <li><Link to="/faq" className="hover:text-primary transition">FAQs</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                © 2024 AutoFix. All rights reserved.
            </div>
        </footer>
    );
}
