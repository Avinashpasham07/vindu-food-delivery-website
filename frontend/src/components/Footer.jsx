import React from 'react';
import { Link } from 'react-router-dom';
import { 
    MessageCircle,
    Send,
    Globe, 
    Heart,
    ShieldCheck,
    Scale
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/5 font-['Plus_Jakarta_Sans']">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FF5E00] rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#FF5E00]/20">V</div>
                            <span className="text-2xl font-black text-white tracking-tighter uppercase">Vindu</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            The world's first social food delivery platform. Orchestrating culinary missions across the city.
                        </p>
                        <div className="flex gap-4">
                            {[MessageCircle, Send, Globe].map((SocialIcon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#FF5E00] hover:border-[#FF5E00]/30 hover:bg-[#FF5E00]/5 transition-all">
                                    <SocialIcon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest mb-6 text-gray-400">Navigation</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li className="text-gray-500 hover:text-white transition-colors"><Link to="/home">Explore Menu</Link></li>
                            <li className="text-gray-500 hover:text-white transition-colors"><Link to="/user/gold">Vindu Gold</Link></li>
                            <li className="text-gray-500 hover:text-white transition-colors"><Link to="/partner/register">Join as Partner</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-xs uppercase tracking-widest mb-6 text-gray-400">Support</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> <Link to="/privacy">Privacy Policy</Link>
                            </li>
                            <li className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                                <Scale className="w-4 h-4" /> <Link to="/terms">Terms of Service</Link>
                            </li>
                            <li className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                                <Globe className="w-4 h-4" /> <Link to="/cookies">Cookie Settings</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Heart className="w-20 h-20 text-[#FF5E00]" />
                        </div>
                        <h4 className="font-bold text-white mb-2">Vindu for Orgs</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Enterprise Solutions</p>
                        <button className="w-full py-3 bg-[#FF5E00] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#FF5E00]/20 hover:bg-orange-600 transition-all">
                            Get Early Access
                        </button>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-700">
                    <p>© 2026 Vindu Technologies Pvt. Ltd. Orchestrating Flavors.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-gray-400 transition-colors cursor-pointer">Security Audit Passed</span>
                        <span className="hover:text-gray-400 transition-colors cursor-pointer">Platform Status: Live</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
