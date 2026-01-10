import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Link } from 'react-router-dom';


import { useCart } from '../../context/CartContext';
import { useSquad } from '../../context/SquadContext';
import SmartCart from '../../components/SmartCart';
import FoodCard from '../../components/FoodCard';
import SkeletonCard from '../../components/SkeletonCard';
import MoodSelector from '../../components/MoodSelector';


const HomePage = () => {
    const { addToCart, decrementItem, getItemQuantity } = useCart();
    const { startSquad, joinSquad, roomId, isHost, squadMembers } = useSquad();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMoodTags, setSelectedMoodTags] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState('Hyderabad');
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [isListening, setIsListening] = useState(false);

    const categories = [
        { id: 1, name: 'Starters', image: 'https://media.istockphoto.com/id/812470140/photo/chicken-malai-tikka-boneless-piece.webp?a=1&b=1&s=612x612&w=0&k=20&c=Chxp4CXlgMaLiWKWkhCUfkqbjOn6ujB0hpC7LWCSvLQ=' },
        { id: 2, name: 'Biryani', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=2070&auto=format&fit=crop' },
        { id: 3, name: 'Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop' },
        { id: 4, name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop' },
        { id: 5, name: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fERlc3NlcnRzfGVufDB8fDB8fHww' },
        { id: 6, name: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1974&auto=format&fit=crop' },
        { id: 7, name: 'Snacks', image: 'https://images.unsplash.com/photo-1517093602195-b40af9688b46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8U25hY2tzfGVufDB8fDB8fHww' },
        { id: 8, name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop' },
        { id: 9, name: 'Thali', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1974&auto=format&fit=crop' }
    ];

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                let transcript = event.results[0][0].transcript;
                // remove trailing punctuation
                transcript = transcript.replace(/[.,!?]$/, '');
                const lowerTranscript = transcript.toLowerCase();

                // Check for category match
                const matchedCategory = categories.find(cat => lowerTranscript.includes(cat.name.toLowerCase()));

                if (matchedCategory) {
                    setSelectedCategory(matchedCategory.name);
                    // Remove the category name from the search term so we can find generic items in that category
                    // e.g. "Chicken Pizza" -> Search "Chicken" in Category "Pizza"
                    const newSearchTerm = transcript.replace(new RegExp(matchedCategory.name, 'i'), '').trim();
                    setSearchTerm(newSearchTerm);
                } else {
                    setSelectedCategory(null);
                    setSearchTerm(transcript);
                }
            };
            recognition.start();
        } else {
            alert("Voice search not supported in this browser.");
        }
    };

    // Debounce Search Term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const locations = ["Hyderabad", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        window.location.reload();
    };



    useEffect(() => {
        // Fetch all food items
        const fetchPartners = async () => {
            try {
                const response = await apiClient.get('/food');
                if (response.data && response.data.fooditems) {
                    setPartners(response.data.fooditems);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
    const placeholders = ["Biryani", "Pizza", "Burger", "Desserts", "Thali", "Healthy"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const filteredItems = partners.filter(item => {
        // Safe check for name and description
        const itemName = item?.name || '';
        const itemDesc = item?.description || '';
        const itemCategory = item?.category || '';

        const matchesSearch = itemName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            itemDesc.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

        const matchesCategory = selectedCategory ? itemCategory === selectedCategory : true;

        // Mood Filtering
        let matchesMood = true;
        if (selectedMoodTags.length > 0) {
            const itemTags = item?.tags || [itemCategory];

            matchesMood = selectedMoodTags.some(tag => {
                const lowerTag = tag.toLowerCase();
                // Check tags array safely
                const tagsMatch = Array.isArray(itemTags) && itemTags.some(it =>
                    (it && typeof it === 'string' && it.toLowerCase().includes(lowerTag))
                );

                return tagsMatch ||
                    itemName.toLowerCase().includes(lowerTag) ||
                    itemCategory.toLowerCase().includes(lowerTag);
            });
        }

        return matchesSearch && matchesCategory && matchesMood;
    });

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FF5E00] selection:text-white pb-32">
            {/* Header */}
            {/* Premium Sticky Header & Navigation */}
            <div className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/5 pb-0 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-5 pt-4 pb-4 flex flex-col gap-4">

                    {/* Top Row: Logo, Location (Mobile), Actions */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-3xl font-black tracking-tighter text-white">
                                Vindu<span className="text-[#FF5E00]">.</span>
                            </Link>
                        </div>

                        {/* Mobile Location Picker (Visible only on mobile) */}
                        <div className="md:hidden flex-1 flex justify-center">
                            <div
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] rounded-full border border-white/10"
                                onClick={() => setIsLocationOpen(!isLocationOpen)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF5E00]">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-bold text-gray-200 max-w-[100px] truncate">{selectedLocation}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isLocationOpen ? 'rotate-180 text-[#FF5E00]' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>


                        {/* Search & Location Capsule (Desktop) */}
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
                                    <span className="text-sm font-bold text-gray-200 truncate w-full group-hover:text-white transition-colors">{selectedLocation}</span>
                                </div>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3 h-3 text-gray-500 ml-auto transition-transform duration-300 ${isLocationOpen ? 'rotate-180 text-[#FF5E00]' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
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
                                                        <span key={i} className="text-base h-[24px] flex items-center font-bold text-orange-500">
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
                                    {searchTerm && (
                                        <button onClick={() => setSearchTerm('')} className="absolute right-10 z-20 p-1 text-gray-500 hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={startListening}
                                        className={`absolute right-2 z-20 p-2 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                                            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-6">
                            {/* Squad Mode Button */}
                            <div className="flex">
                                {roomId ? (
                                    <div className="flex items-center gap-2 bg-[#FF5E00]/20 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-[#FF5E00]/50">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#FF5E00] animate-pulse"></div>
                                        <span className="text-[#FF5E00] text-xs md:text-sm font-bold">Squad: {roomId}</span>
                                        <div className="flex -space-x-2">
                                            {squadMembers.map((m, i) => (
                                                <div key={i} className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-zinc-700 border border-black flex items-center justify-center text-[10px] md:text-xs overflow-hidden" title={m.name}>
                                                    {m.avatar ? <img src={m.avatar} alt={m.name} /> : m.name[0]}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowJoinModal(true)}
                                        className="flex items-center gap-1.5 md:gap-2 text-sm md:text-[18px] font-semibold text-white bg-orange-500 px-3 py-1.5 md:px-6 md:py-2 rounded-full md:rounded-3xl cursor-pointer hover:bg-orange-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-4.42 6.753 6.753 0 01-1.454-3.321 .75.75 0 00-.539-.641 9.776 9.776 0 00-2.833-.422z" />
                                        </svg>
                                        <span>Squad</span>
                                        <span className="hidden md:inline">Mode</span>
                                    </button>
                                )}
                            </div>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/user/profile" className="flex items-center gap-2 hover:bg-orange-500/5 p-2 rounded-lg transition-colors">
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

                    {/* Mobile Search */}
                    <div className="md:hidden px-5 pb-4">
                        {/* Same as before... */}
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
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="p-1 text-gray-500 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={startListening}
                                className={`p-2 rounded-full transition-all ml-1 ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                                    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Shared Dropdown Menu */}
                    {isLocationOpen && (
                        <>
                            <div className="absolute top-[60px] md:top-[80px] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:ml-[200px] w-[90vw] md:w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200 p-2">
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
                            {/* Backdrop to close */}
                            <div className="fixed inset-0 z-[59] bg-transparent" onClick={() => setIsLocationOpen(false)}></div>
                        </>
                    )}
                </div>
            </div>

            {/* Squad Join Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Join or Start Squad</h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    startSquad(user?.fullname || 'Guest', null);
                                    setShowJoinModal(false);
                                }}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-3 rounded-xl font-bold"
                            >
                                Start New Squad
                            </button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#1a1a1a] text-gray-400">Or join existing</span></div>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Room Code"
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-7 py-2 focus:outline-none focus:border-orange-500"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        joinSquad(joinCode, user?.fullname || 'Guest', null);
                                        setShowJoinModal(false);
                                    }}
                                    className="px-4 bg-orange-600 rounded-xl font-bold hover:bg-orange-500 cursor-pointer"
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setShowJoinModal(false)} className="mt-4 text-sm text-gray-500 hover:text-orange-500 cursor-pointer">Cancel</button>
                    </div>
                </div>
            )}
            {/* Categories - Sleek Horizontal Scroll */}
            <div className="mt-12 pl-6">
                <div className="flex items-center justify-between pr-6 mb-6">
                    <h3 className="font-bold text-lg text-white">Explore Menu</h3>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-8 pr-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] snap-x">
                    <div
                        onClick={() => setSelectedCategory(null)}
                        className="snap-start flex flex-col items-center gap-3 min-w-[76px] ml-2 px-2 py-3 cursor-pointer group"
                    >
                        <div className={`w-[76px] h-[76px] rounded-full flex items-center justify-center py-3 transition-all duration-300 ${selectedCategory === null ? 'bg-[#1a1a1a] text-[#FF5E00] ring-2 ring-[#FF5E00] ring-offset-2 ring-offset-[#0d0d0d] shadow-[0_10px_20px_rgba(255,94,0,0.2)]' : 'bg-[#1a1a1a] text-white border border-white/5 hover:border-[#FF5E00] hover:border-2 hover:text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        </div>
                        <span className={`text-xs font-semibold tracking-wide ${selectedCategory === null ? 'text-[#FF5E00]' : 'text-white group-hover:text-white'}`}>All</span>
                    </div>

                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
                            className="snap-start flex flex-col items-center gap-3 min-w-[76px] py-3 cursor-pointer group"
                        >
                            <div className={`w-[76px] h-[76px] rounded-full overflow-hidden relative transition-all duration-300 ${selectedCategory === cat.name ? 'ring-2 ring-[#FF5E00] ring-offset-2 ring-offset-[#0d0d0d] shadow-[0_10px_20px_rgba(255,94,0,0.2)]' : 'border border-white/5 opacity-80 group-hover:opacity-100 group-hover:border-[#FF5E00] group-hover:border-2'}`}>
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500" />
                            </div>
                            <span className={`text-xs font-semibold tracking-wide ${selectedCategory === cat.name ? 'text-[#FF5E00]' : 'text-white group-hover:text-white'}`}>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended Feed - Immersive Cards */}
            <div className="px-5 mt-8">
                <h3 className="font-black text-4xl mb-6 text-white tracking-tight flex items-center gap-2">
                    Trending Near You
                </h3>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* First Batch of Items (Top 6) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.slice(0, 3).map((item) => (
                                <FoodCard key={item._id} item={item} />
                            ))}
                        </div>

                        {/* Mood Selector (Embedded) */}
                        <div className="py-12">
                            <MoodSelector onMoodSelect={(tags) => setSelectedMoodTags(tags)} />
                        </div>

                        {/* Remaining Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.slice(3).map((item) => (
                                <FoodCard key={item._id} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <SmartCart />
        </div>
    );
};

export default HomePage;