import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';

// --- Icons ---
const TrendingUp = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
const DollarSign = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const Smartphone = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
const ArrowRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const CheckCircle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const BarChart3 = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
const ChefHat = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" /></svg>;
const ChevronDown = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>;

// Accordion Component with Single Open Logic
const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="group bg-[#151515] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF5E00]/30 transition-all">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full p-6 flex items-center justify-between font-bold text-white text-left hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        {item.q}
                        <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-[#FF5E00]' : ''}`}
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
const Star = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;

const RestaurantLanding = () => {
    return (
        <div className="min-h-screen bg-[#09090b] text-white font-['Plus_Jakarta_Sans'] selection:bg-[#FF5E00] selection:text-white overflow-x-hidden">

            {/* --- Navbar --- */}
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#FF5E00] rounded-xl flex items-center justify-center font-black text-xl italic text-white shadow-lg">V</div>
                        <span className="text-2xl font-black tracking-tighter">Vindu<span className="text-[#FF5E00]">Partner</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/food-partner/login" className="hidden md:block text-sm font-bold text-gray-400 hover:text-white transition-colors">Login</Link>
                        <Link to="/food-partner/register" className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Add Restaurant
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="relative pt-40 pb-20 px-6">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF5E00]/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5E00]/10 border border-[#FF5E00]/20 mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#FF5E00] animate-pulse"></span>
                            <span className="text-xs font-bold tracking-wide text-[#FF5E00] uppercase">Trusted by 5,000+ Partners</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
                            Scalable growth <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-orange-300">without the chaos.</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
                            The all-in-one platform for modern restaurants. Manage orders, track earnings, and reach social-first customers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/food-partner/register" className="px-8 py-4 bg-[#FF5E00] text-white rounded-full font-bold text-lg hover:bg-[#e05200] transition-colors flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,94,0,0.3)]">
                                Register Now <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="px-8 py-4 bg-[#1a1a1a] border border-white/10 text-white rounded-full font-bold text-lg hover:bg-[#252525] transition-colors flex items-center gap-2">
                                <DollarSign className="w-5 h-5" /> View Pricing
                            </button>
                        </div>
                    </div>

                    <div className="relative perspective-1000">
                        {/* 3D Dashboard Mockup */}
                        <div className="relative z-10 bg-[#0f0f0f] rounded-3xl p-8 border border-white/10 shadow-2xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl"></div>

                            {/* Header */}
                            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">LIVE DASHBOARD</p>
                                    <h3 className="text-3xl font-black text-white">The Spicy Grill</h3>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 animate-pulse">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-gray-400 text-xs mb-1">Today's Sales</p>
                                    <p className="text-2xl font-black text-white">₹24,500</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-gray-400 text-xs mb-1">Active Orders</p>
                                    <p className="text-2xl font-black text-[#FF5E00]">12</p>
                                </div>
                            </div>

                            {/* Orders */}
                            <div className="space-y-3">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Recent activity</p>
                                {[
                                    { id: '#921', item: 'Butter Chicken + Naan', status: 'Cooking', time: '2m' },
                                    { id: '#922', item: 'Veg Biryani Family Pack', status: 'Ready', time: '5m' },
                                    { id: '#923', item: 'Paneer Tikka Roll', status: 'New', time: 'Just now' }
                                ].map((o, i) => (
                                    <div key={i} className="bg-black/20 p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="text-xs font-mono text-gray-500">{o.id}</div>
                                            <div className="text-sm font-bold text-white">{o.item}</div>
                                        </div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded ${o.status === 'New' ? 'bg-[#FF5E00] text-white animate-pulse' : o.status === 'Ready' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                            {o.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Floating Success Badge */}
                        <div className="absolute -bottom-8 -left-8 bg-white text-black p-6 rounded-2xl shadow-xl z-20 animate-bounce-slow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Growth</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black">+45%</span>
                                        <span className="text-xs text-green-600 font-bold">this month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Features Grid --- */}
            <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">Built for scale.</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything you need to run a modern restaurant business.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Smart Analytics', desc: 'Real-time insights on your best sellers and peak hours.', icon: BarChart3 },
                            { title: 'Easy Management', desc: 'Accept orders and manage menu with a single tap.', icon: Smartphone },
                            { title: 'Instant Payouts', desc: 'Direct bank transfers every Wednesday. No delays.', icon: DollarSign }
                        ].map((f, i) => (
                            <div key={i} className="bg-[#0f0f0f] p-8 rounded-[32px] border border-white/5 hover:border-[#FF5E00]/50 transition-all group hover:-translate-y-2">
                                <div className="w-16 h-16 bg-[#FF5E00]/10 rounded-2xl flex items-center justify-center text-[#FF5E00] mb-8 group-hover:scale-110 transition-transform">
                                    <f.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Integration Steps (Vertical) --- */}
            <section className="py-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Launch in <br /><span className="text-[#FF5E00]">3 Steps.</span></h2>
                        <div className="space-y-0">
                            {[
                                { title: "Register", desc: "Fill in basic details & upload FSSAI license." },
                                { title: "Setup Menu", desc: "Use our AI tool to auto-upload your menu." },
                                { title: "Go Live", desc: "Turn on the toggle and start cooking!" }
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-8 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center font-bold text-gray-500 group-hover:bg-[#FF5E00] group-hover:text-black group-hover:border-[#FF5E00] transition-colors">
                                            {idx + 1}
                                        </div>
                                        {idx !== 2 && <div className="w-0.5 h-16 bg-white/10 my-2"></div>}
                                    </div>
                                    <div className="pb-8">
                                        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-[#FF5E00] transition-colors">{step.title}</h3>
                                        <p className="text-gray-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] rounded-[48px] p-12 border border-white/5 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                        <ChefHat className="w-32 h-32 text-[#FF5E00] mx-auto mb-8 transform group-hover:rotate-12 transition-transform duration-500" />
                        <h3 className="text-4xl font-black text-white mb-6">Ready to Cook?</h3>
                        <p className="text-gray-400 mb-10 text-lg">Join 5,000+ partners who increased their revenue by 30%.</p>
                        <Link to="/food-partner/register" className="inline-block w-full py-5 bg-white text-black font-black rounded-2xl text-xl hover:bg-gray-200 transition-transform hover:scale-105 shadow-xl">
                            Register Restaurant
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-black mb-12 text-center">Common Questions</h2>
                    <div className="space-y-4">
                        <Accordion items={[
                            { q: "What documents do I need?", a: "Just your FSSAI license, PAN card, and a cancelled cheque." },
                            { q: "Is the first month really free?", a: "Yes. 0% commission for the first 30 days. You keep 100% of the revenue." },
                            { q: "Do I handle delivery?", a: "No, Vindu has a dedicated fleet of delivery partners assigned to your orders." }
                        ]} />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default RestaurantLanding;
