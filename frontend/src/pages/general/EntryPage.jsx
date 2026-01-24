import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';

// --- Assets & Icons ---
const ArrowRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const Star = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const ChevronDown = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>;
const Users = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const Search = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const Utensils = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>;
const ClipboardList = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>;
const Sparkles = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>;
const TrendingUp = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
const Smartphone = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
const Zap = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const Wallet = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H4z" /><path d="M12 12h8" /></svg>;
const Play = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const Pizza = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" /><path d="M2 16a5 5 0 0 0 10.9 0L13 7 2 16Z" /><path d="m22 17-9-8" /><path d="M15 6a3 3 0 1 0-4.243 4.243" /></svg>;
const Rocket = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>;

// --- Helper Components ---

// Smooth Reveal on Scroll
const Reveal = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return (
        <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {children}
        </div>
    );
};

// Mouse-tracking Spotlight Card
const SpotlightCard = ({ children, className = "" }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{ opacity, background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,94,0,0.15), transparent 40%)` }}
            />
            {children}
        </div>
    );
};

// Accordion Component with Single Open Logic
const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="group bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF5E00]/20 transition-all">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full p-8 flex items-center justify-between font-bold text-xl text-white text-left focus:outline-none"
                    >
                        {item.q}
                        <ChevronDown
                            className={`w-6 h-6 text-gray-600 group-hover:text-[#FF5E00] transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-[#FF5E00]' : ''}`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <p className="px-8 pb-8 text-gray-400 leading-relaxed">
                            {item.a}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// 1. Vertical Roadmap
const Roadmap = () => {
    const [activeTab, setActiveTab] = useState('user');
    const content = {
        user: { steps: [{ title: 'Discover', desc: 'Browse immersive food reels and find hidden gems.', icon: <Search className="w-8 h-8" /> }, { title: 'Squad Up', desc: 'Create a room and order together in real-time.', icon: <Users className="w-8 h-8" /> }, { title: 'Feast', desc: 'Track your order live and enjoy good food.', icon: <Utensils className="w-8 h-8" /> }] },
        partner: { steps: [{ title: 'Register', desc: 'Sign up in 2 minutes. Digital verification.', icon: <ClipboardList className="w-8 h-8" /> }, { title: 'Menu AI', desc: 'Auto-generate appetizing descriptions.', icon: <Sparkles className="w-8 h-8" /> }, { title: 'Grow', desc: 'Get orders instantly. 0% commission.', icon: <TrendingUp className="w-8 h-8" /> }] },
        rider: { steps: [{ title: 'Sign Up', desc: 'Download app and submit license.', icon: <Smartphone className="w-8 h-8" /> }, { title: 'Go Online', desc: 'Log in whenever you want. Total freedom.', icon: <Zap className="w-8 h-8" /> }, { title: 'Earn', desc: 'Weekly payouts directly to bank.', icon: <Wallet className="w-8 h-8" /> }] }
    };

    return (
        <div className="w-full">
            <Reveal>
                <div className="flex justify-center gap-4 mb-20">
                    {['user', 'partner', 'rider'].map((key) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide uppercase transition-all duration-300 border ${activeTab === key ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' : 'bg-transparent border-white/10 text-gray-500 hover:text-white'}`}>
                            For {key === 'user' ? 'Foodies' : key === 'partner' ? 'Partners' : 'Riders'}
                        </button>
                    ))}
                </div>
            </Reveal>
            <div className="relative max-w-4xl mx-auto px-4">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF5E00]/50 via-gray-800 to-transparent md:-translate-x-1/2"></div>
                {content[activeTab].steps.map((step, idx) => (
                    <Reveal key={idx} delay={idx * 100}>
                        <div className={`relative flex flex-col md:flex-row items-center justify-between gap-8 mb-16 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                            <SpotlightCard className="w-full md:w-[45%] bg-[#0f0f0f] border border-white/5 p-8 rounded-[32px] hover:border-[#FF5E00]/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                                <div className="text-[#FF5E00] mb-4 transform group-hover:scale-110 transition-transform">{step.icon}</div>
                                <h3 className="text-2xl font-black text-white mb-2">{step.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
                            </SpotlightCard>
                            <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-10 h-10 rounded-full bg-[#FF5E00] border-4 border-[#050505] z-10 shadow-[0_0_20px_rgba(255,94,0,0.6)] flex items-center justify-center font-bold text-black text-sm">{idx + 1}</div>
                            <div className="hidden md:block w-[45%]"></div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
};

// 2. Bento Grid
const BentoGrid = () => (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
        {/* Card 1: Squad Mode (Interactive Social) */}
        <SpotlightCard className="md:col-span-2 md:row-span-2 rounded-[40px] bg-[#0f0f0f] border border-white/5 p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF5E00]/5 to-transparent"></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-[#FF5E00]/10 text-[#FF5E00] font-bold text-xs uppercase mb-6 border border-[#FF5E00]/20 animate-pulse">Exclusive Feature</div>
                    <h3 className="text-5xl font-black text-white mb-4 tracking-tight">Squad Mode™</h3>
                    <p className="text-gray-400 text-lg max-w-sm mb-8 leading-relaxed">Sync carts in real-time. Invite friends. Split the bill instantly.</p>
                </div>

                {/* Simulated Floating Avatars */}
                <div className="relative h-20">
                    <div className="absolute left-0 bottom-0 flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-14 h-14 rounded-full border-4 border-[#0f0f0f] bg-gray-800 shadow-xl transition-transform duration-500 hover:-translate-y-4 hover:z-20 cursor-pointer overflow-hidden`}>
                                <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="w-14 h-14 rounded-full border-4 border-[#0f0f0f] bg-[#FF5E00] flex items-center justify-center font-bold text-white shadow-xl animate-bounce-slow">+2</div>
                    </div>
                </div>
            </div>

            {/* Simulated Chat Bubbles */}
            <div className="absolute top-10 right-10 flex flex-col items-end gap-3 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
                <div className="bg-[#2a2a2a] px-4 py-2 rounded-2xl rounded-tr-none text-xs text-gray-300 shadow-lg transform translate-x-4 group-hover:translate-x-0 transition-transform duration-500 flex items-center gap-2">Ordering Pizza? <Pizza className="w-3 h-3 text-[#FF5E00]" /></div>
                <div className="bg-[#FF5E00] px-4 py-2 rounded-2xl rounded-tr-none text-xs text-black font-bold shadow-lg transform translate-x-8 group-hover:translate-x-0 transition-transform duration-700 delay-100 flex items-center gap-2">I'm in! <Rocket className="w-3 h-3 text-black" /></div>
            </div>

            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2574&auto=format&fit=crop" className="absolute -right-20 -bottom-20 w-3/4 h-3/4 object-cover opacity-20 mask-image-linear-gradient rotate-[-5deg] group-hover:rotate-0 transition-transform duration-700" />
        </SpotlightCard>

        {/* Card 2: Vindu Gold (Premium Shimmer) */}
        <SpotlightCard className="rounded-[40px] bg-gradient-to-br from-[#1a1500] to-black border border-yellow-500/20 p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="absolute top-0 right-0 p-6"><Star className="w-8 h-8 text-yellow-500 fill-yellow-500" /></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-3xl font-black text-white mb-2">Vindu Gold</h3>
                    <p className="text-gray-400 text-sm mb-6">Unlimited free delivery & exclusive perks.</p>
                </div>

                {/* Premium Metallic Card Visual */}
                <div className="w-full h-32 bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500 flex flex-col justify-between p-5 relative overflow-hidden">
                    {/* Metallic Sheen Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-8 h-5 rounded bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] border border-yellow-600/30 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-[1px] bg-yellow-600/50 mb-[1px]"></div>
                            <div className="w-full h-[1px] bg-yellow-600/50 mt-[1px]"></div>
                        </div>
                        <div className="text-[#422006] font-bold text-xs tracking-widest uppercase opacity-60">Vindu</div>
                    </div>

                    <div className="relative z-10">
                        <div className="text-[#422006] font-black italic text-2xl tracking-widest text-shadow-sm flex items-center gap-2">
                            VINDU <span className="text-xs not-italic font-bold border border-[#422006] px-1 rounded">GOLD</span>
                        </div>

                    </div>
                </div>
            </div>
        </SpotlightCard>

        {/* Card 3: Smart Menu (Tech Scanning) */}
        <SpotlightCard className="rounded-[40px] bg-[#0f0f0f] border border-white/5 p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.08]"></div>

            <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-2">Smart Menu</h3>
                <p className="text-gray-400 text-sm">AI-driven visuals that make you hungry.</p>

                <div className="mt-8 relative p-4 bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                    <div className="h-2 bg-gray-700 rounded-full w-3/4 mb-3"></div>
                    <div className="h-2 bg-gray-700 rounded-full w-1/2 mb-3"></div>
                    <div className="h-20 bg-gray-800 rounded-lg w-full relative overflow-hidden">
                        {/* Scanning Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-scan"></div>
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-blue-400">ANALYZING...</div>
                </div>
            </div>
        </SpotlightCard>
    </div>
);

// --- Main Page ---
const EntryPage = () => {
    // Custom Cursor Logic
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] selection:bg-[#FF5E00] selection:text-white overflow-x-hidden cursor-none">

            {/* Custom Cursor */}
            <div
                className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-[#FF5E00] pointer-events-none z-[9999] transition-all duration-150 ease-out flex items-center justify-center mix-blend-difference ${isHovering ? 'scale-[2.5] bg-[#FF5E00]/20 border-transparent' : 'scale-100'}`}
                style={{ transform: `translate3d(${cursorPos.x - 16}px, ${cursorPos.y - 16}px, 0)` }}
            >
                {isHovering && <div className="w-1 h-1 bg-[#FF5E00] rounded-full"></div>}
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-white/5 transition-all">
                <div className="flex items-center gap-2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className="w-10 h-10 bg-[#FF5E00] rounded-xl flex items-center justify-center font-black text-white italic shadow-[0_0_20px_rgba(255,94,0,0.4)]">V</div>
                    <span className="text-2xl font-black tracking-tighter">Vindu<span className="text-[#FF5E00]">.</span></span>
                </div>
                <Link to="/user/login" className="px-8 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    Sign In
                </Link>
            </nav>

            {/* 1. Hero Section (Redesigned: Human/Product/Split) */}
            <section className="relative pt-32 pb-20 min-h-screen flex items-center overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF5E00]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left: Typography */}
                    <Reveal>
                        <div className="relative z-10 text-left">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1a1a1a] border border-white/10 mb-8 w-fit hover:border-[#FF5E00]/50 transition-colors cursor-crosshair">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5E00] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5E00]"></span>
                                </span>
                                <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">Vindu Live Beta</span>
                            </div>

                            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8">
                                SOCIAL <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-yellow-500">EATING</span> <br />
                                IS HERE.
                            </h1>

                            <p className="text-xl text-gray-400 max-w-lg mb-12 leading-relaxed font-light border-l border-[#FF5E00] pl-6">
                                Don't just deliver food. Deliver a moment. <br />
                                Sync carts, split bills, and eat together. <br />
                                <span className="text-white font-bold">The first app built for connection.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => document.getElementById('gateway').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-[#FF5E00] text-black rounded-full font-black text-lg hover:bg-[#ff7b33] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,94,0,0.4)] flex items-center gap-3">
                                    Start Squad Order <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="px-8 py-4 text-white font-bold text-lg hover:text-[#FF5E00] transition-colors flex items-center gap-2 group">
                                    <span>Watch Manifesto</span>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FF5E00] group-hover:text-black transition-all"><Play className="w-3 h-3 fill-current" /></div>
                                </button>
                            </div>
                        </div>
                    </Reveal>

                    {/* Right: Floating Product Composition */}
                    <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
                        {/* Card 1: The Squad Cart */}
                        <div className="absolute top-[10%] right-[10%] w-[320px] bg-[#1a1a1a] rounded-[32px] border border-white/10 p-6 shadow-2xl rotate-[-6deg] hover:rotate-0 hover:scale-105 transition-all duration-700 z-20 group">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-white text-lg">Friday Night 🍔</h4>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#1a1a1a]"></div>
                                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#1a1a1a]"></div>
                                    <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-[#1a1a1a]"></div>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm p-3 bg-black/40 rounded-xl">
                                    <span className="text-gray-400">Arjun added <span className="text-white">Pepperoni Pizza</span></span>
                                    <span>₹450</span>
                                </div>
                                <div className="flex justify-between text-sm p-3 bg-black/40 rounded-xl">
                                    <span className="text-gray-400">Sarah added <span className="text-white">Coke Zero</span></span>
                                    <span>₹60</span>
                                </div>
                            </div>
                            <div className="w-full py-3 bg-[#FF5E00] rounded-xl text-center font-bold text-black group-hover:bg-white transition-colors">
                                Pay My Share (₹510)
                            </div>
                        </div>

                        {/* Card 2: The Food Reel */}
                        <div className="absolute top-[30%] right-[45%] w-[260px] bg-black rounded-[32px] border-[6px] border-[#222] shadow-2xl rotate-[5deg] hover:rotate-0 hover:z-30 transition-all duration-700 overflow-hidden aspect-[9/16]">
                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent">
                                <div className="flex gap-2 mb-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold">Top Rated</span>
                                </div>
                                <p className="font-bold text-white leading-tight">Melting Cheese Burst...</p>
                            </div>
                        </div>

                        {/* Card 3: Live Status */}
                        <div className="absolute top-[60%] right-[20%] bg-[#0a0a0a] border border-[#FF5E00]/30 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(255,94,0,0.1)] animate-bounce-slow z-30">
                            <div className="w-10 h-10 rounded-full bg-[#FF5E00]/20 flex items-center justify-center text-[#FF5E00]">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase">Live Activity</div>
                                <div className="font-bold text-white">Rahul joined the room</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Global Stats */}
            <section className="py-24 border-y border-white/5 bg-black/50 backdrop-blur-3xl">
                <Reveal>
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
                        {[{ l: "Active Users", v: "2M+" }, { l: "Partners", v: "45K" }, { l: "Cities", v: "18" }, { l: "Orders", v: "850K+" }].map((s, i) => (
                            <div key={i} className="group cursor-default" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-[#FF5E00] transition-colors duration-300">{s.v}</div>
                                <div className="text-gray-500 uppercase tracking-[0.2em] text-xs font-bold">{s.l}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </section>

            {/* 3. Features (Bento) */}
            <section id="features" className="py-40 bg-[#09090b]">
                <Reveal>
                    <div className="text-center mb-24 px-6">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">More than delivery.</h2>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">A complete ecosystem designed for the modern foodie.</p>
                    </div>
                    <BentoGrid />
                </Reveal>
            </section>

            {/* 4. Roadmap */}
            <section className="py-40 bg-[#050505] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <Reveal>
                    <div className="text-center mb-24 px-6">
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Your Journey.</h2>
                        <p className="text-gray-400 text-xl">Simple steps to get started.</p>
                    </div>
                    <Roadmap />
                </Reveal>
            </section>

            {/* 5. Testimonials */}
            <section className="py-40 border-t border-white/5 bg-[#09090b]">
                <Reveal>
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl font-black mb-16 text-center">Community Love</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Sneha R.", role: "User", text: "Squad mode is a lifesaver for office lunches. We use it every Friday!" },
                                { name: "Arjun M.", role: "Partner", text: "Weekly payouts help my cash flow immensely. Best partner support." },
                                { name: "Rahul K.", role: "Rider", text: "Insurance coverage gives me peace of mind for my family." }
                            ].map((r, i) => (
                                <SpotlightCard key={i} className="bg-[#0f0f0f] p-10 rounded-[32px] border border-white/5 hover:border-[#FF5E00]/20 group">
                                    <div className="flex text-[#FF5E00] gap-1 mb-6"><Star className="w-5 h-5 fill-[#FF5E00]" /><Star className="w-5 h-5 fill-[#FF5E00]" /><Star className="w-5 h-5 fill-[#FF5E00]" /><Star className="w-5 h-5 fill-[#FF5E00]" /><Star className="w-5 h-5 fill-[#FF5E00]" /></div>
                                    <p className="text-gray-300 italic mb-8 text-lg leading-relaxed">"{r.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                                        <div>
                                            <div className="font-bold text-white">{r.name}</div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{r.role}</div>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* 6. FAQ */}
            <section className="py-40 bg-[#050505]">
                <Reveal>
                    <div className="max-w-3xl mx-auto px-6 space-y-4">
                        <h2 className="text-4xl font-black mb-16 text-center">FAQ</h2>
                        <Accordion items={[
                            { q: "Is it free to use?", a: "Yes, complete free to join for everyone." },
                            { q: "Where do you deliver?", a: "We are currently live in 18 metro cities across India." },
                            { q: "How do I become a partner?", a: "Click the 'Sell' card below and fill out the form." }
                        ]} />
                    </div>
                </Reveal>
            </section>

            {/* 7. Role Gateway (Revised Copy) */}
            <section id="gateway" className="py-40 relative">
                <Reveal>
                    <div className="max-w-7xl mx-auto px-6 text-center mb-24">
                        <h2 className="text-5xl md:text-8xl font-black mb-8 leading-none">Your Journey Starts Here.</h2>
                        <p className="text-gray-400 text-xl font-light">Select your role to unlock the ecosystem.</p>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 h-[700px]">
                        {[
                            {
                                id: 'eat',
                                title: 'Order Food',
                                subtitle: 'Hungry? Discover the best food near you.',
                                link: '/landing',
                                img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2562&auto=format&fit=crop'
                            },
                            {
                                id: 'sell',
                                title: 'Partner with Us',
                                subtitle: 'List your restaurant & grow your business.',
                                link: '/partner',
                                img: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=687&auto=format&fit=crop'
                            },
                            {
                                id: 'ride',
                                title: 'Join as Delivery Boy',
                                subtitle: 'Earn weekly payouts with flexible hours.',
                                link: '/rider',
                                img: 'https://images.unsplash.com/photo-1613274554329-70f997f5789f?q=80&w=2574&auto=format&fit=crop'
                            }
                        ].map((card) => (
                            <Link
                                key={card.id}
                                to={card.link}
                                className="relative group rounded-[48px] overflow-hidden border border-white/10 flex items-end p-12 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(255,94,0,0.2)] transition-all duration-500 cursor-pointer"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <img src={card.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                                <div className="relative z-10 w-full flex flex-col justify-end items-start h-full">
                                    <h3 className="text-5xl font-black text-white mb-4 leading-tight">{card.title}</h3>
                                    <p className="text-gray-300 text-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                        {card.subtitle}
                                    </p>
                                    <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-[#FF5E00] flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform shadow-lg"><ArrowRight /></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Reveal>
            </section>

            <Footer />
        </div>
    );
};

export default EntryPage;
