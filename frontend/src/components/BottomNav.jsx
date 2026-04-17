import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Home, Play, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
    const location = useLocation();
    const isReels = location.pathname === '/reels';
    const isCart = location.pathname === '/cart';
    const { cartCount } = useCart();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/5 pb-5 pt-2 px-4 z-50 flex justify-around items-center md:hidden transition-all duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {/* User Type Logic */}
            {localStorage.getItem('userType') === 'partner' ? (
                <Link to="/partner/dashboard" className={`relative flex flex-col items-center gap-0.5 transition-all duration-300 ${location.pathname === '/partner/dashboard' ? 'text-[#FF5E00] -translate-y-0.5' : 'text-gray-500 hover:text-gray-300'}`}>
                    <div className={`p-1.5 rounded-full transition-all duration-300 ${location.pathname === '/partner/dashboard' ? 'bg-[#FF5E00]/10' : ''}`}>
                        <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-bold transition-opacity duration-300 ${location.pathname === '/partner/dashboard' ? 'opacity-100' : 'opacity-60'}`}>Dashboard</span>
                </Link>
            ) : (
                <Link to="/home" className={`relative flex flex-col items-center gap-0.5 transition-all duration-300 ${location.pathname === '/home' || location.pathname === '/' ? 'text-[#FF5E00] -translate-y-0.5' : 'text-gray-500 hover:text-gray-300'}`}>
                    <div className={`p-1.5 rounded-full transition-all duration-300 ${(location.pathname === '/home' || location.pathname === '/') ? 'bg-[#FF5E00]/10' : ''}`}>
                        <Home className="w-5 h-5 sm:w-6 sm:h-6" fill={(location.pathname === '/home' || location.pathname === '/') ? "currentColor" : "none"} />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-bold transition-opacity duration-300 ${(location.pathname === '/home' || location.pathname === '/') ? 'opacity-100' : 'opacity-60'}`}>Home</span>
                </Link>
            )}

            <Link to="/reels" className={`relative flex flex-col items-center gap-0.5 transition-all duration-300 ${isReels ? 'text-[#FF5E00] -translate-y-0.5' : 'text-gray-500 hover:text-gray-300'}`}>
                <div className={`p-1.5 rounded-full transition-all duration-300 ${isReels ? 'bg-[#FF5E00]/10' : ''}`}>
                    <Play className="w-5 h-5 sm:w-6 sm:h-6" fill={isReels ? "currentColor" : "none"} />
                </div>
                <span className={`text-[9px] sm:text-[10px] font-bold transition-opacity duration-300 ${isReels ? 'opacity-100' : 'opacity-60'}`}>Reels</span>
            </Link>

            {
                localStorage.getItem('userType') !== 'partner' && (
                    <Link to="/cart" className={`relative flex flex-col items-center gap-0.5 transition-all duration-300 ${isCart ? 'text-[#FF5E00] -translate-y-0.5' : 'text-gray-500 hover:text-gray-300'}`}>
                        <div className={`p-1.5 rounded-full transition-all duration-300 ${isCart ? 'bg-[#FF5E00]/10' : ''} relative`}>
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" fill={isCart ? "currentColor" : "none"} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF5E00] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-[#0d0d0d]">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-bold transition-opacity duration-300 ${isCart ? 'opacity-100' : 'opacity-60'}`}>Cart</span>
                    </Link>
                )
            }

            {
                localStorage.getItem('userType') !== 'partner' && (
                    <Link to="/user/profile" className={`relative flex flex-col items-center gap-0.5 transition-all duration-300 ${location.pathname === '/user/profile' ? 'text-[#FF5E00] -translate-y-0.5' : 'text-gray-500 hover:text-gray-300'}`}>
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border flex items-center justify-center shadow-lg group-active:scale-95 transition-transform ${location.pathname === '/user/profile' ? 'border-[#FF5E00] bg-[#FF5E00]/10' : 'border-gray-700 bg-gray-800'}`}>
                            <User className={`w-4 h-4 sm:w-5 sm:h-5 ${location.pathname === '/user/profile' ? 'text-[#FF5E00]' : 'text-gray-400'}`} fill={location.pathname === '/user/profile' ? "currentColor" : "none"} />
                        </div>
                    </Link>
                )
            }
        </div>
    );
};

export default BottomNav;
