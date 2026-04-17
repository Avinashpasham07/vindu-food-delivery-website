import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Home, Play, ShoppingBag, User, Menu } from 'lucide-react';
import BottomNav from './BottomNav';
import { useCart } from '../context/CartContext';

const Navigation = ({ isExpanded: propIsExpanded, setIsExpanded: propSetIsExpanded }) => {
    const location = useLocation();
    const [internalExpanded, setInternalExpanded] = useState(false);

    const isExpanded = propIsExpanded !== undefined ? propIsExpanded : internalExpanded;
    const setIsExpanded = propSetIsExpanded || setInternalExpanded;

    const { cartCount } = useCart();

    const isActive = (path) => {
        return location.pathname === path ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-gray-400 hover:text-white hover:bg-white/5';
    };

    const userType = localStorage.getItem('userType');

    const navItems = [
        ...(userType === 'partner' ? [{
            path: '/partner/dashboard',
            label: 'Dashboard',
            icon: (
                <LayoutGrid className="w-6 h-6" />
            )
        }] : [{
            path: '/home',
            label: 'Home',
            icon: (
                <Home className="w-6 h-6" />
            )
        }]),
        {
            path: '/reels',
            label: 'Reels',
            icon: (
                <Play className="w-6 h-6" />
            )
        },
        ...(userType !== 'partner' ? [{
            path: '/cart',
            label: 'Cart',
            icon: (
                <div className="relative">
                    <ShoppingBag className="w-6 h-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-[#0d0d0d]">
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
                <User className="w-6 h-6" />
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
                        <Menu className="w-6 h-6" />
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
