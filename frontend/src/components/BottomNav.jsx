import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
    const location = useLocation();
    const isReels = location.pathname === '/reels';
    const isCart = location.pathname === '/cart';
    const { cartCount } = useCart();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/5 pb-6 pt-3 px-6 z-50 flex justify-around items-center md:hidden transition-all duration-300">
            {/* User Type Logic */}
            {localStorage.getItem('userType') === 'partner' ? (
                <Link to="/partner/dashboard" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${location.pathname === '/partner/dashboard' ? 'text-[#FF5E00] -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}>
                    <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/partner/dashboard' ? 'bg-[#FF5E00]/10' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                    </div>
                    <span className={`text-[10px] font-medium transition-opacity duration-300 ${location.pathname === '/partner/dashboard' ? 'opacity-100' : 'opacity-70'}`}>Dashboard</span>
                </Link>
            ) : (
                <Link to="/" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${location.pathname === '/' ? 'text-[#FF5E00] -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}>
                    <div className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/' ? 'bg-[#FF5E00]/10' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </div>
                    <span className={`text-[10px] font-medium transition-opacity duration-300 ${location.pathname === '/' ? 'opacity-100' : 'opacity-70'}`}>Home</span>
                </Link>
            )}

            <Link to="/reels" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isReels ? 'text-[#FF5E00] -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}>
                <div className={`p-2 rounded-full transition-all duration-300 ${isReels ? 'bg-[#FF5E00]/10' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isReels ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                </div>
                <span className={`text-[10px] font-medium transition-opacity duration-300 ${isReels ? 'opacity-100' : 'opacity-70'}`}>Reels</span>
            </Link>



            {
                localStorage.getItem('userType') !== 'partner' && (
                    <Link to="/cart" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isCart ? 'text-[#FF5E00] -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}>
                        <div className={`p-2 rounded-full transition-all duration-300 ${isCart ? 'bg-[#FF5E00]/10' : ''} relative`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isCart ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF5E00] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-[#0d0d0d]">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] font-medium transition-opacity duration-300 ${isCart ? 'opacity-100' : 'opacity-70'}`}>Cart</span>
                    </Link>
                )
            }

            {
                localStorage.getItem('userType') !== 'partner' && location.pathname !== '/' && (
                    <Link to="/user/profile" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${location.pathname === '/user/profile' ? 'text-[#FF5E00] -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}>
                        <div className={`w-10 h-10 rounded-full overflow-hidden border flex items-center justify-center shadow-lg group-active:scale-95 transition-transform ${location.pathname === '/user/profile' ? 'border-[#FF5E00] bg-[#FF5E00]/10' : 'border-gray-700 bg-gray-800'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/user/profile' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 ${location.pathname === '/user/profile' ? 'text-[#FF5E00]' : 'text-gray-400'}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                    </Link>
                )
            }
        </div >
    );
};

export default BottomNav;
