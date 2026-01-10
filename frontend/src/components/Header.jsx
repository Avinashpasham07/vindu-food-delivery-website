import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ searchTerm, setSearchTerm, selectedLocation, setSelectedLocation }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const user = JSON.parse(localStorage.getItem('user'));

    // Location State (Internal to Header if mostly UI, but passed from parent for persistence)
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const locations = ["Hyderabad", "Mumbai", "Delhi", "Bangalore", "Chennai", "Pune"]; // Hardcoded for now matching HomePage

    // Search Placeholders Animation
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
    const placeholders = ["Biryani", "Pizza", "Burger", "Desserts", "Thali", "Healthy"];

    useEffect(() => {
        if (!isHome) return;
        const interval = setInterval(() => {
            setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isHome]);


    return (
        <div className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/5 pb-0 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-5 pt-4 pb-4 flex items-center gap-8 justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to="/" className="text-3xl font-black tracking-tighter text-white">
                        Savor<span className="text-[#FF5E00]">To.</span>
                    </Link>
                </div>

                {/* Search & Location Capsule - ONLY ON HOME */}
                {isHome && (
                    <div className="flex-1 max-w-2xl hidden md:flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl px-2 h-12 shadow-sm transition-all focus-within:border-[#FF5E00]/50 focus-within:shadow-[0_0_20px_rgba(255,94,0,0.1)]">
                        {/* Location */}
                        <div
                            className="relative flex items-center gap-2 px-3 border-r border-white/10 h-3/4 w-[35%] min-w-[180px] cursor-pointer hover:bg-white/5 rounded-lg transition-colors group"
                            onClick={() => setIsLocationOpen(!isLocationOpen)}
                        >
                            <div className="p-1 rounded-full bg-[#FF5E00]/10 group-hover:bg-[#FF5E00]/20 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#FF5E00]">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>

                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="text-xs font-medium text-gray-500 group-hover:text-[#FF5E00] transition-colors">Location</span>
                                <span className="text-sm font-bold text-gray-200 truncate w-full group-hover:text-white transition-colors">{selectedLocation || 'Hyderabad'}</span>
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3 h-3 text-gray-500 ml-auto transition-transform duration-300 ${isLocationOpen ? 'rotate-180 text-[#FF5E00]' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>

                            {/* Dropdown Menu */}
                            {isLocationOpen && (
                                <>
                                    <div className="absolute top-full left-0 mt-4 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200 p-2">
                                        <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] space-y-1">
                                            {locations.map((loc) => (
                                                <div
                                                    key={loc}
                                                    className={`px-3 py-2.5 mx-1 rounded-lg text-sm cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between group/item ${selectedLocation === loc ? 'bg-white/5' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLocation(loc);
                                                        setIsLocationOpen(false);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedLocation === loc ? 'bg-white/10 text-white' : 'bg-[#0d0d0d] text-gray-500 group-hover/item:text-white'}`}>
                                                            <span className="font-bold text-xs">{loc[0]}</span>
                                                        </div>
                                                        <span className={`font-medium ${selectedLocation === loc ? 'text-white' : 'text-gray-400 group-hover/item:text-gray-200'}`}>{loc}</span>
                                                    </div>

                                                    {selectedLocation === loc && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#FF5E00]">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-8 w-4 h-4 bg-[#1a1a1a] border-t border-l border-white/10 transform rotate-45 -mt-[9px] z-[61]"></div>
                                </>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="flex-1 flex items-center px-3 relative h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-gray-500 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <div className="relative w-full h-full flex items-center overflow-hidden">
                                {!searchTerm && (
                                    <div className="absolute inset-0 flex items-center pointer-events-none">
                                        <span className="text-gray-500 mr-1.5 whitespace-nowrap">Search for</span>
                                        <div className="h-[24px] overflow-hidden relative w-full">
                                            <div
                                                className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                                                style={{ transform: `translateY(-${currentPlaceholderIndex * 24}px)` }}
                                            >
                                                {placeholders.map((text, i) => (
                                                    <span key={i} className="text-base h-[24px] flex items-center font-bold text-gray-400">
                                                        {text}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    className="w-full h-full bg-transparent text-sm font-medium focus:outline-none text-white absolute inset-0 z-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Right Side Actions (User Profile) - Always Visible */}
                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/user/profile" className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-lg transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5E00] to-[#FF9050] flex items-center justify-center text-white font-bold text-sm">
                                    {user.fullname ? user.fullname[0].toUpperCase() : 'U'}
                                </div>
                                <span className="text-gray-300 font-medium hidden sm:block">{user.fullname}</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6 text-gray-300 text-lg font-light">
                            <Link to="/user/login" className="hover:text-white cursor-pointer hidden sm:block transition-colors">Log in</Link>
                            <Link to="/user/register" className="hover:text-white cursor-pointer hidden sm:block transition-colors">Sign up</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search - Visible Only on Small Screens & Home Page */}
            {isHome && (
                <div className="md:hidden px-5 pb-4 bg-[#0d0d0d]">
                    <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl px-3 h-12">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-[#FF5E00] mr-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-transparent text-white focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
