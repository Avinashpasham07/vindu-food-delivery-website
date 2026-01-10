import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import apiClient from '../../api/client';
import { useCart } from '../../context/CartContext';

const UserProfile = () => {
    const navigate = useNavigate();
    const { addToCart, clearCart } = useCart();
    const [user, setUser] = useState(null);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
    const [orders, setOrders] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            const socket = io('http://localhost:3000');
            socket.emit('join_user_room', parsedUser.id || parsedUser._id);

            socket.on('order-updated', (updatedOrder) => {
                console.log("Order Update Received:", updatedOrder);
                setOrders(prevOrders => prevOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o));
            });

            return () => socket.disconnect();
        } else {
            navigate('/user/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (activeTab === 'orders' || activeTab === 'overview') {
            const fetchOrders = async () => {
                if (activeTab === 'orders') setLoadingOrders(true);
                try {
                    const token = localStorage.getItem('token');
                    const headers = token ? { Authorization: `Bearer ${token}` } : {};

                    const response = await apiClient.get('/orders/user-orders', { headers });
                    setOrders(response.data);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }

        if (activeTab === 'favorites' || activeTab === 'overview') {
            const fetchFavorites = async () => {
                if (activeTab === 'favorites') setLoadingFavorites(true);
                try {
                    const token = localStorage.getItem('token');
                    const headers = token ? { Authorization: `Bearer ${token}` } : {};

                    const response = await apiClient.get('/auth/user/favorites', { headers });
                    if (response.data && response.data.favorites) {
                        setFavorites(response.data.favorites);
                    }
                } catch (error) {
                    console.error("Error fetching favorites:", error);
                } finally {
                    setLoadingFavorites(false);
                }
            };
            fetchFavorites();
        }
    }, [activeTab]);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#000] flex items-center justify-center text-white font-['Plus_Jakarta_Sans']">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#FF5E00]/20 border-t-[#FF5E00] rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] pb-20 selection:bg-[#FF5E00]/30 selection:text-[#FF5E00] relative">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#FF5E00]/10 rounded-full blur-[150px] opacity-40 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] opacity-30"></div>
                <div className="absolute inset-0 bg-white/5 opacity-10 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in-up">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 group">
                            <div className="p-2 rounded-full border border-white/5 bg-white/5 group-hover:border-[#FF5E00]/50 group-hover:text-[#FF5E00] transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
                            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-amber-500">{user.fullname?.split(' ')[0] || 'User'}</span>.
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg font-medium">Welcome to your personal command center.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#FF5E00]/20 flex items-center gap-2 shadow-lg shadow-[#FF5E00]/5">
                            <div className="w-2 h-2 rounded-full bg-[#FF5E00] animate-pulse"></div>
                            <span className="text-xs font-bold text-[#FF5E00] uppercase tracking-wider">Savor Gold Member</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group shadow-2xl transition-all hover:border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF5E00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-[#FF5E00] via-amber-500 to-yellow-500 animate-spin-slow">
                                        <div className="w-full h-full rounded-full bg-[#111] border-4 border-[#111] flex items-center justify-center overflow-hidden relative z-10 transition-transform hover:scale-105">
                                            {user.profileImage ? (
                                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-5xl font-black text-white">{user.fullname?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-1">{user.fullname}</h2>
                                <p className="text-gray-500 text-sm font-medium mb-6">{user.email}</p>

                                <div className="w-full grid grid-cols-2 gap-3">
                                    <button className="py-3 rounded-xl bg-[#1A1A1A] border border-white/5 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-all">Edit Profile</button>
                                    <button onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); localStorage.removeItem('userType'); window.location.href = '/user/login'; }} className="py-3 rounded-xl bg-red-500/10 border border-red-500/10 text-sm font-bold text-red-500 hover:bg-red-500/20 transition-all">Log Out</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
                            {['overview', 'orders', 'favorites'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-t-2xl text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#FF5E00] bg-gradient-to-b from-[#1a1a1a] to-transparent border-b-2 border-[#FF5E00]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-[#111] p-6 rounded-[24px] border border-white/5 hover:border-[#FF5E00]/30 transition-all group relative overflow-hidden">
                                        <span className="text-3xl font-black text-white block mb-1 relative z-10">{orders.length}</span>
                                        <span className="text-xs uppercase font-bold text-gray-500 relative z-10">Total Orders</span>
                                    </div>
                                    <div className="bg-[#111] p-6 rounded-[24px] border border-white/5 hover:border-[#FF5E00]/30 transition-all group relative overflow-hidden">
                                        <span className="text-3xl font-black text-white block mb-1 relative z-10">{favorites.length}</span>
                                        <span className="text-xs uppercase font-bold text-gray-500 relative z-10">Favorites</span>
                                    </div>
                                    <div className="bg-[#111] p-6 rounded-[24px] border border-white/5 hover:border-[#FF5E00]/30 transition-all group relative overflow-hidden">
                                        <span className="text-3xl font-black text-white block mb-1 relative z-10">0</span>
                                        <span className="text-xs uppercase font-bold text-gray-500 relative z-10">Reviews</span>
                                    </div>
                                </div>

                                <div className="w-full bg-gradient-to-r from-[#FF5E00] to-orange-600 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-2xl">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
                                    <div className="relative z-10 max-w-lg">
                                        <h3 className="text-3xl font-black text-white mb-2">Invite friends, get ₹100</h3>
                                        <p className="text-white/80 font-medium mb-6">Share your referral code and earn bonus credits for every friend who joins SavorTo.</p>
                                        <button className="px-6 py-3 bg-white text-[#FF5E00] rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-colors">Share Code</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-6 animate-fade-in-up">
                                {loadingOrders ? (
                                    <div className="flex justify-center p-12">
                                        <div className="w-8 h-8 border-4 border-[#FF5E00] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="bg-[#111] border border-white/5 rounded-[32px] p-12 text-center animate-fade-in-up">
                                        <h3 className="text-xl font-bold text-white mb-2">No past orders</h3>
                                        <Link to="/" className="px-8 py-3 bg-[#FF5E00] text-white rounded-xl font-bold hover:bg-[#e05200] transition-colors">Order Now</Link>
                                    </div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order._id} className="bg-[#111] border border-white/5 rounded-[32px] p-6 lg:p-8 hover:border-[#FF5E00]/30 transition-all group shadow-lg">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-3 py-1 bg-[#222] rounded-full text-xs font-bold text-gray-400 border border-white/5">#{order._id.slice(-6).toUpperCase()}</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#FF5E00]/10 text-[#FF5E00] border-[#FF5E00]/20'}`}>{order.status}</span>
                                                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                            <button
                                                                onClick={() => navigate(`/order/tracking/${order._id}`)}
                                                                className="ml-auto px-3 py-1 bg-[#FF5E00] text-white text-[10px] font-bold rounded-full hover:bg-orange-600 transition-colors animate-pulse"
                                                            >
                                                                Track Live 📍
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-500 text-sm font-medium">{formatDate(order.createdAt)} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-white">₹{order.totalAmount}</p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">{order.items.length} Items</p>
                                                </div>
                                            </div>

                                            <div className="bg-[#151515] rounded-2xl p-4 mb-6">
                                                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex-shrink-0 flex items-center gap-3 pr-4 border-r last:border-0 border-white/5">
                                                            <div className="w-12 h-12 rounded-xl bg-[#222] overflow-hidden">
                                                                {item.video ? <video src={item.video} className="w-full h-full object-cover" muted loop autoPlay playsInline /> : <img src={item.image} className="w-full h-full object-cover" alt="" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{item.quantity} x {item.name}</p>
                                                                <p className="text-xs text-[#FF5E00] font-bold">₹{item.price}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {order.deliveryPartner && (
                                                <div className="mb-6 p-4 bg-[#1a1a1a] rounded-xl border border-white/5 flex justify-between items-center animate-in fade-in">
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Delivery Partner</p>
                                                        <p className="text-white font-bold text-lg">{order.deliveryPartner.fullname}</p>
                                                        <p className="text-green-500 text-xs font-bold">● {order.deliveryStatus || 'Assigned'}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedContact({
                                                            name: order.deliveryPartner.fullname,
                                                            phone: order.deliveryPartner.phone
                                                        })}
                                                        className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                                    >
                                                        <span>📞</span> Call
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-500 font-bold text-xs uppercase mb-1">Delivered To</span>
                                                    <span className="text-gray-300 font-medium max-w-[200px] truncate">{order.address?.address || 'Shipping Address'}</span>
                                                </div>
                                                <button onClick={() => { clearCart(); order.items.forEach(item => { addToCart({ _id: item.foodId, name: item.name, price: item.price, image: item.image, video: item.video }, item.quantity); }); navigate('/cart'); }} className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold text-xs border border-white/5 transition-all">Reorder</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="space-y-6 animate-fade-in-up">
                                {loadingFavorites ? (
                                    <div className="flex justify-center p-12">
                                        <div className="w-8 h-8 border-4 border-[#FF5E00] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : favorites.length === 0 ? (
                                    <div className="bg-[#111] border border-white/5 rounded-[32px] p-12 text-center animate-fade-in-up">
                                        <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
                                        <Link to="/" className="px-8 py-3 bg-[#FF5E00] text-white rounded-xl font-bold hover:bg-[#e05200] transition-colors">Explore Food</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {favorites.map(item => (
                                            <div key={item._id} onClick={() => navigate(`/food/${item._id}`)} className="bg-[#111] border border-white/5 rounded-[24px] p-4 flex gap-4 hover:border-[#FF5E00]/30 transition-all group cursor-pointer">
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#222]">
                                                    {item.fileType === 'image' ? <img src={item.video} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} /> : <video src={item.video} className="w-full h-full object-cover" muted />}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white leading-tight mb-1 line-clamp-1">{item.name}</h3>
                                                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[#FF5E00] font-black text-lg">₹{item.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-sm p-6 border border-white/10 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedContact(null)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"
                        >
                            ✕
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#FF5E00]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                📞
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{selectedContact.name}</h3>
                            <p className="text-gray-500 text-sm mb-6">Contact Details</p>

                            <div className="bg-[#050505] rounded-xl p-4 border border-white/5 mb-6">
                                <p className="text-2xl font-mono text-[#FF5E00] tracking-wider">{selectedContact.phone}</p>
                            </div>

                            <a
                                href={`tel:${selectedContact.phone}`}
                                className="block w-full py-3 bg-[#FF5E00] hover:bg-orange-600 text-white font-bold rounded-xl transition-all"
                            >
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
