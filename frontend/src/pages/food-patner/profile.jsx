import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { id } = useParams();
    const [partner, setPartner] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Partner Details
                const partnerRes = await axios.get(`http://localhost:3000/api/auth/partner/${id}`);
                setPartner(partnerRes.data.partner);

                // Fetch Partner's Food Items
                const foodRes = await axios.get(`http://localhost:3000/api/food/partner/${id}`);
                setFoodItems(foodRes.data.fooditems);

            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center font-['Plus_Jakarta_Sans']">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#FF5E00]/20 border-t-[#FF5E00] rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-gray-400 animate-pulse">Loading Chef's Kitchen...</p>
                </div>
            </div>
        );
    }

    if (!partner) {
        return <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">Partner not found.</div>;
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-['Plus_Jakarta_Sans']">
            {/* Immersive Header Section */}
            <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                    {partner.profileImage ? (
                        <img src={partner.profileImage} alt="Cover" className="w-full h-full object-cover blur-xl opacity-40 scale-110" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent"></div>
                </div>

                {/* Profile Content */}
                <div className="absolute inset-0 flex flex-col justify-end pb-12 px-6">
                    <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end gap-8">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5E00] to-[#ff9100] rounded-full opacity-75 blur transition duration-500 group-hover:opacity-100"></div>
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#151515] border-4 border-[#0d0d0d] overflow-hidden flex items-center justify-center shadow-2xl">
                                {partner.profileImage ? (
                                    <img src={partner.profileImage} alt={partner.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-black text-[#FF5E00]">{partner.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>

                        {/* Info Block */}
                        <div className="flex-1 mb-2">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 leading-none">
                                {partner.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm md:text-base font-medium">
                                <span className="flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF5E00]">
                                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    {partner.address || "Location unavailable"}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span className="text-[#FF5E00]">Open Now</span>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex gap-4">
                            <div className="px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
                                <span className="block text-2xl font-black text-white">{foodItems.length}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dishes</span>
                            </div>
                            <div className="px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center min-w-[100px]">
                                <span className="block text-2xl font-black text-white">4.8</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 py-12 md:px-6">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-white">Featured Menu</h2>
                    <div className="h-px flex-1 bg-white/10"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {foodItems.map((item) => (
                        <Link to={`/food/${item._id}`} key={item._id} className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#151515] border border-white/5 shadow-lg">
                            {/* Media Background */}
                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                {item.fileType === 'image' ? (
                                    <img src={item.video} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={item.video} className="w-full h-full object-cover" muted />
                                )}
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="mb-1">
                                    <span className="inline-block px-2 py-1 rounded-lg bg-[#FF5E00]/20 text-[#FF5E00] text-[10px] font-bold uppercase tracking-wider mb-2 border border-[#FF5E00]/20 backdrop-blur-sm">
                                        ₹{item.price}
                                    </span>
                                    <h3 className="text-lg font-bold text-white leading-tight mb-1 line-clamp-2">{item.name}</h3>
                                    <p className="text-xs text-gray-300 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {foodItems.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-300">No dishes yet</h3>
                            <p className="text-gray-500 text-sm mt-1">This chef hasn't uploaded any items.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Back Button */}
            <Link
                to="/home"
                className="fixed top-6 right-6 z-50 w-12 h-12 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-[#FF5E00] hover:border-[#FF5E00] transition-all duration-300 shadow-xl group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </Link>
        </div>
    );
};

export default Profile;