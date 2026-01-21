import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';

const GoldMembership = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleJoinGold = async () => {
        if (!user) {
            navigate('/user/login');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.post('/auth/buy-gold', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                // Update local storage user
                const updatedUser = { ...user, isGoldMember: true };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                showToast("Welcome to Vindu Gold! 👑", "success");
                navigate('/user/profile');
            }
        } catch (error) {
            console.error("Purchase failed:", error);
            showToast("Transaction Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-['Plus_Jakarta_Sans'] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none"></div>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#FFD700]/20 rounded-full blur-[150px] animate-pulse-slow"></div>

            <div className="max-w-4xl mx-auto px-6 pt-20 pb-20 relative z-10 text-center">

                {/* Header Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#FFD700] font-bold text-sm mb-8 animate-fade-in-up">
                    <span className="animate-pulse">👑</span> OFFICIAL MEMBERSHIP
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#FFD700] via-[#FDB931] to-[#9E7204] drop-shadow-2xl animate-fade-in-up animation-delay-100">
                    VINDU GOLD
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
                    Experience dining like royalty. Unlimited free delivery, exclusive discounts, and priority support.
                </p>

                {/* Card */}
                <div className="bg-[#111] border border-[#FFD700]/30 rounded-[40px] p-8 md:p-12 max-w-md mx-auto relative group hover:border-[#FFD700]/60 transition-all duration-500 shadow-[0_0_50px_rgba(255,215,0,0.1)] hover:shadow-[0_0_80px_rgba(255,215,0,0.2)] animate-fade-in-up animation-delay-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent rounded-[40px] opacity-50"></div>

                    <div className="relative z-10">
                        <div className="text-sm font-bold text-[#FFD700] uppercase tracking-widest mb-4">Limited Time Offer</div>
                        <div className="flex justify-center items-end gap-1 mb-8">
                            <span className="text-6xl font-black text-white">₹199</span>
                            <span className="text-xl text-gray-500 font-bold mb-2">/ month</span>
                        </div>

                        <ul className="space-y-4 text-left mb-10">
                            {[
                                "Unlimited Free Delivery",
                                "Up to 30% Extra Discount",
                                "Priority Support 24/7",
                                "No Surge Fees during Rain"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] text-xs">✓</div>
                                    {benefit}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleJoinGold}
                            disabled={loading || user?.isGoldMember}
                            className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg ${user?.isGoldMember
                                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black hover:shadow-[#FFD700]/40"
                                }`}
                        >
                            {loading ? "Processing..." : user?.isGoldMember ? "You are already a Member" : "Join Vindu Gold Now"}
                        </button>
                        <p className="text-xs text-gray-600 mt-4 font-bold">Cancel anytime. Terms apply.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GoldMembership;
