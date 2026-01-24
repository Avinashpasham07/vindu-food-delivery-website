import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import FoodCursor from '../../components/FoodCursor';
// Inline Icons to avoid dependency issues
const Bike = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6h-5a1 1 0 0 0-1 1v4h12V7a1 1 0 0 0-1-1h-2" /><path d="M12 17.5V11" /><path d="M5.5 14h13" /></svg>;
const Clock = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const DollarSign = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const Shield = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const ArrowRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const BatteryCharging = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" /><line x1="23" y1="13" x2="23" y2="11" /><polyline points="11 6 7 12 13 12 9 18" /></svg>;

const DeliveryLanding = () => {
    const [scrolled, setScrolled] = useState(false);
    const [hours, setHours] = useState(8);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] selection:bg-green-500 selection:text-white overflow-x-hidden">
            <FoodCursor />
            {/* --- Navbar --- */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center font-black text-xl italic text-black">V</div>
                        <span className="text-2xl font-black tracking-tighter">Vindu<span className="text-green-500">Rider</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/delivery/login" className="hidden md:block text-sm font-bold text-gray-400 hover:text-white transition-colors">Login</Link>
                        <Link to="/delivery/register" className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-sm transition-all">
                            Join Vindu
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="relative pt-40 pb-20 px-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px] -z-10"></div>

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8 mx-auto">
                        <Bike className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold tracking-wide text-green-500 uppercase">Be Your Own Boss</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                        Ride. Deliver. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Earn Daily.</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Turn your bike into an earning machine. Flexible hours, instant payouts, and comprehensive insurance support.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/delivery/register" className="px-10 py-4 bg-green-500 text-black rounded-full font-bold text-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2">
                            Join Now <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* --- Stats Banner --- */}
            <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                    <div className="p-8 text-center bg-[#0a0a0a]">
                        <h4 className="text-3xl font-black text-white mb-1">₹35k+</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase">Monthly Earnings</p>
                    </div>
                    <div className="p-8 text-center bg-[#0a0a0a]">
                        <h4 className="text-3xl font-black text-white mb-1">Weekly</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase">Payouts</p>
                    </div>
                    <div className="p-8 text-center bg-[#0a0a0a]">
                        <h4 className="text-3xl font-black text-white mb-1">Flexible</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase">Choosing Hours</p>
                    </div>
                    <div className="p-8 text-center bg-[#0a0a0a]">
                        <h4 className="text-3xl font-black text-white mb-1">₹5L</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase">Insurance Cover</p>
                    </div>
                </div>
            </div>

            {/* --- Benefits Grid --- */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-black mb-16 text-center">Benefits of Vindu Rider</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-[#111] p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Clock className="w-10 h-10 text-green-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3 text-white">Flexible timings</h3>
                            <p className="text-gray-400">Log in and log out whenever you want. You are the boss of your own schedule.</p>
                        </div>

                        <div className="bg-[#111] p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <BatteryCharging className="w-10 h-10 text-green-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3 text-white">EV Support</h3>
                            <p className="text-gray-400">Get exclusive discounts on EV bike rentals and charging stations through our partners.</p>
                        </div>

                        <div className="bg-[#111] p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Shield className="w-10 h-10 text-green-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-3 text-white">Safety First</h3>
                            <p className="text-gray-400">Free accident insurance cover up to ₹5 Lakhs for you and your family.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Earnings Calculator (Visual) --- */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-black mb-6">Calculate your earnings</h2>
                        <p className="text-gray-400 mb-8">See how much you can earn based on the number of hours you ride.</p>

                        <div className="bg-[#151515] p-8 rounded-3xl border border-white/5">
                            <div className="mb-8">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400 font-bold">Hours per day</span>
                                    <span className="text-green-500 font-bold">8 Hours</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-green-500"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-center">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Weekly</p>
                                    <p className="text-2xl font-black text-white">₹8,500</p>
                                </div>
                                <div className="h-8 w-px bg-white/10"></div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Monthly</p>
                                    <p className="text-2xl font-black text-green-500">₹34,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Map/App Visual */}
                    <div className="relative h-[400px] bg-[#111] rounded-[40px] border border-white/5 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center grayscale"></div>
                        <div className="relative z-10 bg-black p-6 rounded-2xl border border-white/10 shadow-2xl max-w-xs text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-black font-bold text-2xl">₹</div>
                            <h3 className="font-black text-white text-xl mb-1">Payment Received</h3>
                            <p className="text-gray-400 text-sm mb-4">Order #88392 completed!</p>
                            <p className="text-3xl font-black text-green-500">+₹125</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Rider FAQ --- */}
            <section className="py-24 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-black mb-12 text-center">Common Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "What documents do I need?", a: "Valid Driving License (for bike), PAN Card, Aadhar Card, and Bank Passbook/Cancelled Cheque." },
                            { q: "Do I have to wear the t-shirt?", a: "Yes, wearing the Vindu partner t-shirt and carrying the bag is mandatory while on duty." },
                            { q: "Is fuel reimbursed?", a: "Fuel costs are included in the per-kilometer payout structure." }
                        ].map((item, i) => (
                            <div key={i} className="group bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                                <button
                                    className="w-full flex items-center justify-between p-6 text-left font-bold text-white hover:bg-white/5 transition-colors"
                                    onClick={(e) => {
                                        const p = e.currentTarget.nextElementSibling;
                                        if (p.style.maxHeight) {
                                            p.style.maxHeight = null;
                                            e.currentTarget.querySelector('svg').style.transform = 'rotate(0deg)';
                                        } else {
                                            p.style.maxHeight = p.scrollHeight + "px";
                                            e.currentTarget.querySelector('svg').style.transform = 'rotate(180deg)';
                                        }
                                    }}
                                >
                                    <span>{item.q}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>
                                <div className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out px-6">
                                    <p className="pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Footer --- */}
            <section className="py-24 text-center bg-green-500 text-black">
                <h2 className="text-5xl md:text-7xl font-black mb-8">
                    Ready to ride?
                </h2>
                <Link to="/delivery/register" className="inline-flex items-center gap-3 px-12 py-5 bg-black text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-2xl">
                    Register as Rider <ArrowRight />
                </Link>
            </section>
            <Footer />
        </div>
    );
};

export default DeliveryLanding;
