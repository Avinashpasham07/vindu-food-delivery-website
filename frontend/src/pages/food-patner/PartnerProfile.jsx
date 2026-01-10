import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PartnerProfile = () => {
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null);

    useEffect(() => {
        const storedPartner = localStorage.getItem('partner');
        if (storedPartner) {
            setPartner(JSON.parse(storedPartner));
        } else {
            // navigate('/food-partner/login');
        }
    }, [navigate]);

    if (!partner) {
        return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">Loading Profile...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-['Plus_Jakarta_Sans'] p-6 md:p-12">
            <div className="max-w-3xl mx-auto bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden p-8 shadow-2xl relative">
                {/* Decorative Background for Header */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#10B981]/20 to-transparent"></div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">
                    <div className="w-32 h-32 rounded-full border-4 border-[#10B981] bg-[#222] flex items-center justify-center shadow-lg">
                        <span className="text-4xl font-black text-white">{partner.name?.[0]}</span>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white mb-2">{partner.name}</h1>
                        <p className="text-gray-400 text-lg flex items-center justify-center md:justify-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#10B981]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {partner.address || "No address set"}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Verified Partner
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Contact Name</label>
                        <div className="text-white text-lg font-medium">{partner.contactName || "N/A"}</div>
                    </div>
                    <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Phone Number</label>
                        <div className="text-white text-lg font-medium">{partner.phone || "N/A"}</div>
                    </div>
                    <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5 md:col-span-2">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Email Address</label>
                        <div className="text-white text-lg font-medium">{partner.email}</div>
                    </div>
                </div>

                <button className="mt-8 px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition w-full shadow-lg shadow-[#10B981]/20">
                    Edit Business Details
                </button>
            </div>
        </div>
    );
};

export default PartnerProfile;
