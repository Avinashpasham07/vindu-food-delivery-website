import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/5 font-['Plus_Jakarta_Sans']">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-black italic">V</div>
                            <span className="text-xl font-bold text-white">Vindu.</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            The world's first social food delivery platform. Eating is better together.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="hover:text-[#FF5E00] cursor-pointer transition-colors"><Link to="/about">About Us</Link></li>
                            <li className="hover:text-[#FF5E00] cursor-pointer transition-colors"><Link to="/user/gold">Vindu Gold</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-white">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="hover:text-[#FF5E00] cursor-pointer transition-colors"><Link to="/terms">Terms & Conditions</Link></li>
                            <li className="hover:text-[#FF5E00] cursor-pointer transition-colors"><Link to="/privacy">Privacy Policy</Link></li>
                            <li className="hover:text-[#FF5E00] cursor-pointer transition-colors"><Link to="/cookies">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>© 2026 Vindu Technologies Pvt. Ltd.</p>
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Twitter</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Facebook</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
