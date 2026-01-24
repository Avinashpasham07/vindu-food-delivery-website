import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import FoodCursor from '../../components/FoodCursor';

// --- Icons (Inline SVGs to prevent version errors) ---
const MapPin = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const Search = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const ArrowRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const Users = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const ShoppingBag = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);
const Star = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const TrendingUp = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="group bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF5E00]/30 transition-all">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full p-6 flex items-center justify-between font-bold text-white text-left hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        {item.q}
                        <ArrowRight
                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === i ? 'rotate-90 text-[#FF5E00]' : ''}`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                            {item.a}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        { name: "Biryani", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=2670&auto=format&fit=crop" },
        { name: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2699&auto=format&fit=crop" },
        { name: "Pizza", img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2670&auto=format&fit=crop" },
        { name: "Sushi", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2670&auto=format&fit=crop" },
        { name: "Rolls", img: "https://images.unsplash.com/photo-1626802100868-b3d95b542065?q=80&w=2670&auto=format&fit=crop" },
        { name: "Ice Cream", img: "https://images.unsplash.com/photo-1563729768-7491131ba718?q=80&w=2670&auto=format&fit=crop" },
        { name: "Healthy", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop" },
        { name: "Noodles", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=2584&auto=format&fit=crop" },
    ];

    const collections = [
        { title: "Legendary Biryanis", places: "25 Places", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2574&auto=format&fit=crop" },
        { title: "Romantic Dining", places: "18 Places", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop" },
        { title: "Late Night Cravings", places: "30 Places", img: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=2670&auto=format&fit=crop" },
        { title: "Best Rooftops", places: "12 Places", img: "https://images.unsplash.com/photo-1519671482538-518b5c2bf1c6?q=80&w=2574&auto=format&fit=crop" },
    ];

    return (
        <div className="min-h-screen bg-[#09090b] text-white font-['Plus_Jakarta_Sans'] selection:bg-[#FF5E00] selection:text-white overflow-x-hidden">
            <FoodCursor />

            {/* --- Navbar --- */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#FF5E00] rounded-xl flex items-center justify-center font-black text-xl italic text-white shadow-[0_0_15px_rgba(255,94,0,0.5)]">
                            V
                        </div>
                        <span className="text-2xl font-black tracking-tighter hidden md:block">Vindu<span className="text-[#FF5E00]">.</span></span>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className={`hidden md:flex items-center bg-white/10 border border-white/10 rounded-full px-4 py-2.5 w-96 backdrop-blur-md transition-all ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                        <MapPin className="w-4 h-4 text-[#FF5E00] mr-2" />
                        <span className="text-sm font-medium text-gray-300 pr-3 border-r border-gray-600 truncate max-w-[100px]">Hyderabad</span>
                        <Search className="w-4 h-4 text-gray-400 ml-3 mr-2" />
                        <input type="text" placeholder="Search for biryani, pizza..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500" />
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/user/login" className="hidden md:block text-sm font-bold text-gray-400 hover:text-white transition-colors">Log In</Link>
                        <Link to="/user/register" className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-sm transition-all flex items-center gap-2">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF5E00]/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5E00]/10 border border-[#FF5E00]/20 mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#FF5E00] animate-pulse"></span>
                            <span className="text-xs font-bold tracking-wide text-[#FF5E00] uppercase">#1 Social Food Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
                            Food tastes better <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-orange-400">with friends.</span>
                        </h1>
                        <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                            Watch immersive food reels, invite friends to a Squad Room, and order together. No app download needed - just pure taste.
                        </p>

                        <div className="bg-white p-2 rounded-2xl flex items-center shadow-2xl max-w-md transform transition-transform hover:scale-[1.02]">
                            <div className="hidden md:flex items-center px-4 border-r border-gray-200">
                                <MapPin className="w-5 h-5 text-[#FF5E00]" />
                                <input type="text" placeholder="Secunderabad" className="w-32 p-2 text-black font-bold text-sm outline-none placeholder:font-medium" />
                            </div>
                            <div className="flex-1 flex items-center px-4">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="Search for 'Butter Chicken'..." className="w-full p-2 text-black outline-none" />
                            </div>
                            <button className="bg-[#FF5E00] hover:bg-[#e05200] text-white p-3 rounded-xl transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <div className="relative z-10 w-[300px] mx-auto bg-black rounded-[40px] border-[8px] border-gray-900 shadow-2xl overflow-hidden aspect-[9/19] transform rotate-[-6deg] hover:rotate-0 transition-all duration-700">
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-800">
                                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" alt="Food Reel" className="w-full h-full object-cover opacity-80" />
                                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black to-transparent">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-white"></div>
                                        <span className="font-bold text-sm">Bella Italia</span>
                                    </div>
                                    <p className="text-white font-black text-xl leading-tight mb-4">Cheesy Pepperoni Explosion 🍕</p>
                                    <button className="w-full py-3 bg-[#FF5E00] text-white rounded-xl font-bold text-sm">Order Now • ₹450</button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-20 -right-10 bg-[#1a1a1a] p-4 rounded-xl border border-white/10 shadow-xl animate-bounce-slow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Order Status</div>
                                    <div className="font-bold text-sm">On the way <span className="text-[#FF5E00]">12m</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Live Ticker (NEW) --- */}
            <div className="bg-[#FF5E00] py-3 overflow-hidden">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-8 mx-4 text-black font-bold text-sm uppercase tracking-wider">
                            <span>🔥 Arjun just ordered Chicken 65</span>
                            <span>•</span>
                            <span>🍔 Sarah just joined Squad "Office Lunch"</span>
                            <span>•</span>
                            <span>🍕 50% OFF on Pizza Hut</span>
                            <span>•</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- "What's on your mind?" --- */}
            <section className="py-16 border-b border-white/5 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-xl font-bold mb-8 text-gray-200">What's on your mind?</h3>
                    <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#FF5E00] transition-all duration-300">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <span className="text-sm font-bold text-gray-400 group-hover:text-white">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Collections (NEW SECTION) --- */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black mb-2">Curated Collections</h2>
                            <p className="text-gray-400">Explore lists of top restaurants, cafes, and bars, based on trends.</p>
                        </div>
                        <a href="#" className="text-[#FF5E00] font-bold text-sm flex items-center gap-1">All Collections <ArrowRight className="w-4 h-4" /></a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {collections.map((item, idx) => (
                            <div key={idx} className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer">
                                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 inset-x-0 p-6">
                                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                    <div className="flex items-center text-sm font-medium text-gray-300">
                                        <span>{item.places}</span>
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Squad Mode Feature --- */}
            <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="text-[#FF5E00] font-bold tracking-widest uppercase mb-4">Squad Mode</div>
                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                Order Together.<br />
                                <span className="text-gray-500">Pay Separately.</span>
                            </h2>
                            <p className="text-xl text-gray-400 mb-8">
                                Hosting a movie night? Send a Vindu link. Your friends add their own food from their phones. One cart, individual payments.
                            </p>
                            <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <Users className="w-5 h-5" /> Try Squad Mode
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#FF5E00] blur-[100px] opacity-10"></div>
                            <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gray-700 rounded-full border-2 border-white/10 overflow-hidden">
                                        <img src="https://i.pravatar.cc/150?img=12" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-bold">Team Lunch 🍔</span>
                                            <span className="text-[#FF5E00] text-xs font-bold px-2 py-1 bg-[#FF5E00]/10 rounded">LIVE</span>
                                        </div>
                                        <div className="text-xs text-gray-400">Created by You</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-black rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <img src="https://i.pravatar.cc/150?img=3" className="w-6 h-6 rounded-full" />
                                            <span className="text-sm">Rahul added 2 Burgers</span>
                                        </div>
                                        <span className="text-green-500 text-xs">Paid</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-black rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <img src="https://i.pravatar.cc/150?img=5" className="w-6 h-6 rounded-full" />
                                            <span className="text-sm">Priya added 1 Coke</span>
                                        </div>
                                        <span className="text-[#FF5E00] text-xs animate-pulse">Paying...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Top Brands (NEW SECTION) --- */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8 text-gray-200">Top Brands in Your Area</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {["McDonald's", "KFC", "Burger King", "Dominos", "Subway", "Starbucks"].map((brand, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors cursor-pointer h-40">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black font-black text-xs shadow-lg">
                                    {brand[0]}
                                </div>
                                <span className="font-bold text-sm">{brand}</span>
                                <div className="text-xs text-gray-400 flex items-center gap-1"><span className="w-4 h-4 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-[10px]">⏱</span> 25 min</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Vindu Gold (NEW USER SECTION) --- */}
            <section className="py-20 bg-gradient-to-r from-yellow-900/20 to-black border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] -z-10"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold tracking-wide text-yellow-500 uppercase">Vindu Gold</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Unlock Unlimited <br /><span className="text-yellow-500">Free Deliveries.</span></h2>
                        <ul className="space-y-4 mb-8">
                            {['0 Delivery Fee on all orders', 'Extra 30% OFF on dining out', 'Priority delivery during rush hours'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300">
                                    <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 text-xs">✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors">
                            Try Gold Free for 30 Days
                        </button>
                    </div>
                    {/* Gold Card Visual */}
                    <div className="relative">
                        <div className="w-full aspect-video bg-gradient-to-br from-yellow-400 to-yellow-700 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)] p-8 flex flex-col justify-between transform rotate-2 hover:rotate-0 transition-all duration-500 border border-yellow-200/20">
                            <div className="flex justify-between items-start">
                                <span className="text-black font-black text-2xl italic">Vindu Gold.</span>
                                <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Star className="w-6 h-6 text-black" />
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-black/60 text-xs font-bold uppercase tracking-widest mb-1">MEMBER SINCE</p>
                                    <p className="text-black font-bold text-lg">2024</p>
                                </div>
                                <p className="text-black font-black text-xl tracking-widest">•••• 8829</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* --- FAQ Section (NEW) --- */}
            <section className="py-20 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-black mb-12 text-center">Frequently Asked Questions</h2>
                    <Accordion items={[
                        { q: "Is there a minimum order value?", a: "No, you can order as little or as much as you like. However, a small order fee may apply for orders below ₹100." },
                        { q: "How does Squad Mode work?", a: "Create a squad link, share it with friends, and everyone adds items to a shared cart. You can then split the bill instantly." },
                        { q: "Do you offer Vindu Gold for free?", a: "New users can try Vindu Gold free for 30 days to enjoy unlimited free deliveries." },
                        { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI (GPay, PhonePe), and Cash on Delivery." }
                    ]} />
                </div>
            </section>

            {/* --- Customer Love (Testimonials) --- */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-black mb-12 text-center">Loved by Foodies in Hyderabad</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sneha Reddy", role: "Food Blogger", text: "The Squad Mode is a game changer! Ordering for office parties has never been this easy. No more calculating who owes what.", img: "https://i.pravatar.cc/150?img=5" },
                            { name: "Arjun Mehta", role: "Software Engineer", text: "Vindu Gold pays for itself in just 3 orders. The delivery speed is consistently faster than other apps I've used.", img: "https://i.pravatar.cc/150?img=11" },
                            { name: "Priya Sharma", role: "Student", text: "Finally an app that looks as good as the food. The reels feature helps me decide what to eat when I'm confused!", img: "https://i.pravatar.cc/150?img=9" }
                        ].map((review, i) => (
                            <div key={i} className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 hover:border-[#FF5E00]/30 transition-all">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                                </div>
                                <p className="text-gray-300 mb-6 italic">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <img src={review.img} alt={review.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <div className="font-bold text-sm">{review.name}</div>
                                        <div className="text-xs text-gray-500">{review.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Footer (Web First) --- */}
            <section className="py-24 text-center">
                <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-8">
                    HUNGRY? Order Now..
                </h2>
                <Link to="/user/register" className="inline-flex items-center gap-3 px-12 py-5 bg-[#FF5E00] text-white text-xl font-extrabold rounded-full ">
                    Start Ordering Now <ArrowRight />
                </Link>
            </section>

            {/* --- Footer --- */}
            <Footer />
        </div>
    );
};

export default LandingPage;