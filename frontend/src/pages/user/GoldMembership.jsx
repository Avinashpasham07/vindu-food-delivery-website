import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';

const GoldMembership = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleJoinGold = () => {
        if (!user) {
            navigate('/user/login');
            return;
        }

        // Navigate to payment page with amount
        navigate('/user/payment', { state: { amount: 199 } });
    };

    return (
        <div className="min-h-screen bg-black text-white font-['Plus_Jakarta_Sans'] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none"></div>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#FFD700]/20 rounded-full blur-[150px] animate-pulse-slow"></div>

            <div className="max-w-6xl mx-auto px-6 pt-20 pb-20 relative z-10 text-center">

                {/* Header Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#FFD700] font-bold text-sm mb-8 animate-fade-in-up">
                    <span className="animate-pulse">👑</span> OFFICIAL MEMBERSHIP
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter flex items-center justify-center gap-4 bg-clip-text text-transparent bg-gradient-to-b from-[#FFD700] via-[#FDB931] to-[#9E7204] drop-shadow-2xl animate-fade-in-up animation-delay-100">
                    VINDU GOLD
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 animate-fade-in-up animation-delay-200">
                    Join the elite club of foodies. Get treated like royalty at every restaurant and delivery.
                </p>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Monthly Plan */}
                    <div className="bg-[#111] border border-white/10 rounded-[40px] p-8 md:p-10 relative group hover:border-[#FFD700]/60 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:shadow-[0_0_80px_rgba(255,215,0,0.1)] flex flex-col">
                        <div className="bg-[#FFD700]/10 text-[#FFD700] font-bold text-xs uppercase tracking-widest py-1 px-3 rounded-full w-fit mb-6">Most Flexible</div>
                        <h3 className="text-2xl font-bold text-white mb-2 text-left">Monthly Plan</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-5xl font-black text-white">₹199</span>
                            <span className="text-lg text-gray-500 font-bold mb-1">/ month</span>
                        </div>
                        <ul className="space-y-4 text-left flex-1 mb-10">
                            {["Unlimited Free Delivery", "No Surge Fees", "Priority Support"].map((b, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300"><span className="text-[#FFD700]">✓</span> {b}</li>
                            ))}
                        </ul>
                        <button
                            onClick={() => { if (user?.isGoldMember) return; navigate('/user/payment', { state: { amount: 199 } }) }}
                            disabled={user?.isGoldMember}
                            className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${user?.isGoldMember ? 'bg-gray-800 text-gray-500' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            {user?.isGoldMember ? "Current Plan" : "Choose Monthly"}
                        </button>
                    </div>

                    {/* Yearly Plan (Highlighted) */}
                    <div className="bg-[#111] border border-[#FFD700] rounded-[40px] p-8 md:p-10 relative group transform md:-translate-y-4 shadow-[0_0_60px_rgba(255,215,0,0.15)] flex flex-col">
                        <div className="absolute top-0 right-0 bg-[#FFD700] text-black font-black text-xs uppercase px-4 py-2 rounded-bl-2xl rounded-tr-[35px]">Best Value</div>
                        <div className="bg-[#FFD700]/20 text-[#FFD700] font-bold text-xs uppercase tracking-widest py-1 px-3 rounded-full w-fit mb-6">Yearly Plan</div>
                        <h3 className="text-2xl font-bold text-white mb-2 text-left">Annual Royal</h3>
                        <div className="flex items-end gap-1 mb-8">
                            <span className="text-5xl font-black text-white">₹1499</span>
                            <span className="text-lg text-gray-500 font-bold mb-1">/ year</span>
                        </div>
                        <p className="text-left text-green-500 font-bold text-sm mb-6">You save ₹889/year</p>
                        <ul className="space-y-4 text-left flex-1 mb-10">
                            {["Everything in Monthly", "Exclusive Dining Invites", "Birthday Special Gift", "Dedicated Relationship Manager"].map((b, i) => (
                                <li key={i} className="flex items-center gap-3 text-white"><span className="w-5 h-5 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-bold text-xs">✓</span> {b}</li>
                            ))}
                        </ul>
                        <button
                            onClick={() => { if (user?.isGoldMember) return; navigate('/user/payment', { state: { amount: 1499 } }) }}
                            disabled={user?.isGoldMember}
                            className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl ${user?.isGoldMember ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black hover:shadow-[#FFD700]/40 hover:scale-105'}`}
                        >
                            {user?.isGoldMember ? "Current Plan" : "Choose Yearly"}
                        </button>
                    </div>
                </div>

                <p className="text-gray-500 mt-12 text-sm">Prices inclusive of taxes. Cancel anytime.</p>

            </div>
        </div>
    );
};

export default GoldMembership;
