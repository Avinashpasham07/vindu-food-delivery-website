import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useCart } from '../context/CartContext';

const Navigation = ({ isExpanded: propIsExpanded, setIsExpanded: propSetIsExpanded }) => {
    const location = useLocation();
    const [internalExpanded, setInternalExpanded] = useState(false);

    const isExpanded = propIsExpanded !== undefined ? propIsExpanded : internalExpanded;
    const setIsExpanded = propSetIsExpanded || setInternalExpanded;

    const { cartCount } = useCart();

    const isActive = (path) => {
        return location.pathname === path ? 'text-[#FF5E00] bg-[#FF5E00]/10' : 'text-gray-400 hover:text-white hover:bg-white/5';
    };

    const userType = localStorage.getItem('userType');

    const navItems = [
        ...(userType === 'partner' ? [{
            path: '/partner/dashboard',
            label: 'Dashboard',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            )
        }] : [{
            path: '/',
            label: 'Home',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            )
        }]),
        {
            path: '/reels',
            label: 'Reels',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
            )
        },
        ...(userType !== 'partner' ? [{
            path: '/cart',
            label: 'Cart',
            icon: (
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF5E00] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-[#0d0d0d]">
                            {cartCount}
                        </span>
                    )}
                </div>
            )
        }] : []),
        ...(userType !== 'partner' && location.pathname !== '/' ? [{
            path: '/user/profile',
            label: 'Profile',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            )
        }] : []),

    ];

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <BottomNav />

            {/* Desktop Side Navigation - Collapsible */}
            {/* Desktop Side Navigation - Collapsible */}
            <div
                className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-[#0d0d0d] border-r border-[#333] z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64 p-6' : 'w-20 p-4 items-center'}`}
            >
                <div className={`mb-10 w-full flex items-center transition-all duration-300 ${isExpanded ? 'justify-end' : 'justify-center'}`}>
                    {/* Hamburger / Toggle Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-2 rounded-lg hover:bg-white/10 text-white transition-colors`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-4 py-3 rounded-xl transition-all ${isActive(item.path)} ${isExpanded ? 'px-4' : 'justify-center w-12 h-12 p-0'}`}
                        >
                            <div className="min-w-[24px]">
                                {React.cloneElement(item.icon, { className: "w-6 h-6 relative" })}
                            </div>

                            <span className={`font-bold text-lg whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 w-full">
                    {/* Logout logic removed as per previous instructions */}
                </div>
            </div>
        </>
    );
};

export default Navigation;
