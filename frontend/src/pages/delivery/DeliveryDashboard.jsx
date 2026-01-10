import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate, Link } from 'react-router-dom';

const socket = io('http://localhost:3000');

const DeliveryDashboard = () => {
    const [partner, setPartner] = useState(JSON.parse(localStorage.getItem('deliveryPartner')));
    const [availableOrders, setAvailableOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [rejectedOrderIds, setRejectedOrderIds] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [stats, setStats] = useState({ todayEarnings: 0 }); // Local stats state for header
    const navigate = useNavigate();

    useEffect(() => {
        if (!partner) {
            navigate('/delivery/login');
            return;
        }

        socket.emit('join_delivery');
        fetchOrders();
        fetchCurrentOrder();
        fetchStats(); // Fetch earnings for header

        socket.on('new-order', (order) => {
            setAvailableOrders(prev => [order, ...prev]);
        });

        socket.on('order-taken', ({ orderId }) => {
            setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
        });

        return () => {
            socket.off('new-order');
            socket.off('order-taken');
        };
    }, []);

    // Live Geolocation Tracking
    useEffect(() => {
        let watchId;
        if (activeOrder && activeOrder.deliveryStatus !== 'Delivered') {
            if ("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude, heading } = position.coords;
                        socket.emit('update-location', {
                            orderId: activeOrder._id,
                            location: { lat: latitude, lng: longitude, heading }
                        });
                    },
                    (error) => console.error("Geo Error:", error),
                    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
                );
            }
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [activeOrder]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/delivery/orders/available', { withCredentials: true });
            setAvailableOrders(res.data.orders);
        } catch (err) { console.error(err); }
    };

    const fetchCurrentOrder = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/delivery/orders/current', { withCredentials: true });
            if (res.data.order) {
                setActiveOrder(res.data.order);
                setIsOnline(false);
            }
        } catch (err) { console.error(err); }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/delivery/history', { withCredentials: true });
            if (res.data.stats) setStats(res.data.stats);
        } catch (err) { console.error(err); }
    };

    const toggleStatus = async () => {
        try {
            const newStatus = isOnline ? 'offline' : 'online';
            await axios.post('http://localhost:3000/api/delivery/toggle-status', { status: newStatus }, { withCredentials: true });
            setIsOnline(!isOnline);
        } catch (err) { console.error(err); }
    };

    const acceptOrder = async (orderId) => {
        try {
            const res = await axios.post('http://localhost:3000/api/delivery/orders/accept', { orderId }, { withCredentials: true });
            setActiveOrder(res.data.order);
            setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
            setIsOnline(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Error accepting order');
            fetchOrders();
        }
    };

    const updateStatus = async (status) => {
        try {
            const res = await axios.put('http://localhost:3000/api/delivery/orders/status', { orderId: activeOrder._id, status }, { withCredentials: true });
            setActiveOrder(res.data.order);
            if (status === 'Delivered') {
                setActiveOrder(null);
                fetchStats(); // Update earnings immediately
                alert('Delivery Complete! Great job. 🚀');
                setIsOnline(true);
            }
        } catch (err) { console.error(err); }
    };

    if (!partner) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 pb-20 font-['Plus_Jakarta_Sans'] relative overflow-x-hidden selection:bg-[#FF5E00]/30">
            {/* Map Pattern Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            {/* Premium Header */}
            <header className="flex justify-between items-center mb-6 sticky top-0 bg-[#050505]/90 backdrop-blur-xl z-50 py-4 border-b border-white/5 -mx-4 px-4 shadow-sm">

                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/delivery/dashboard" className="text-2xl font-black tracking-tighter text-white">
                        Savor<span className="text-[#FF5E00]">To.</span>
                    </Link>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-3">
                    {/* Status Toggle */}
                    <button
                        onClick={toggleStatus}
                        disabled={!!activeOrder}
                        className={`h-9 px-3 rounded-full flex items-center gap-2 text-[10px] font-bold transition-all shadow-lg ${isOnline
                            ? 'bg-green-500 text-black hover:bg-green-400 shadow-green-500/20'
                            : 'bg-[#222] text-gray-400 border border-white/10 hover:bg-[#333]'
                            } ${activeOrder ? 'opacity-50 cursor-not-allowed hidden md:flex' : ''}`}
                    >
                        {isOnline ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                                ONLINE
                            </>
                        ) : (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                OFFLINE
                            </>
                        )}
                    </button>

                    {/* Profile */}
                    <div onClick={() => navigate('/delivery/profile')} className="relative cursor-pointer group flex items-center gap-2">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-white leading-none">{partner.fullname.split(' ')[0]}</p>
                            <p className="text-[10px] text-[#FF5E00] font-bold">₹{stats.todayEarnings}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF5E00] to-orange-400 p-[2px]">
                            <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center font-black text-white group-hover:bg-transparent transition-all">
                                {partner.fullname.charAt(0)}
                            </div>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#050505] ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            {activeOrder ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#111] border border-[#FF5E00]/30 rounded-[32px] overflow-hidden shadow-[0_0_60px_rgba(255,94,0,0.15)] relative">
                        {/* Map Header Visual */}
                        <div className="h-24 bg-[#1a1a1a] relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6 flex justify-between items-center z-10">
                                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] animate-pulse"></div>
                                <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-500 to-[#FF5E00]/50 mx-4 border-t border-dashed border-white/30"></div>
                                <div className="w-3 h-3 bg-[#FF5E00] rounded-full shadow-[0_0_20px_#f97316]"></div>
                            </div>
                        </div>

                        <div className="p-6 pt-0 relative z-10 -mt-6">
                            {/* Order Status Card */}
                            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-xl mb-6 backdrop-blur-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-[#FF5E00] text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
                                                {activeOrder.deliveryStatus}
                                            </span>
                                            <span className="text-gray-400 text-xs font-mono">#{activeOrder._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <h2 className="text-3xl font-black text-white tracking-tight">₹{activeOrder.totalAmount}</h2>
                                        <p className="text-gray-500 text-xs font-medium uppercase mt-1">{activeOrder.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Paid'}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                        <span className="text-2xl">🛵</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="space-y-6">
                                {/* Pickup */}
                                <div className="flex gap-4 relative">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${activeOrder.deliveryStatus === 'Assigned' ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-[#222] border-white/10 text-gray-500'}`}>A</div>
                                        <div className="w-[2px] h-full bg-white/5 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h4 className="text-sm font-bold text-gray-200">Restaurant Pickup</h4>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Wait for order readiness at the counter.</p>
                                    </div>
                                </div>

                                {/* Drop */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${activeOrder.deliveryStatus !== 'Assigned' ? 'bg-[#FF5E00] border-[#FF5E00] text-white shadow-lg shadow-orange-500/30' : 'bg-[#222] border-white/10 text-gray-500'}`}>B</div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start w-full">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-200">{activeOrder.userId?.fullname || 'Customer'}</h4>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-[200px]">
                                                    {activeOrder.address?.street}, {activeOrder.address?.city}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedContact({ name: activeOrder.userId?.fullname, phone: activeOrder.userId?.phone })}
                                                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-[#FF5E00] hover:bg-[#FF5E00]/10 transition-colors"
                                            >
                                                📞
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slide to Action Area */}
                        <div className="p-4 bg-[#151515] border-t border-white/5">
                            {activeOrder.deliveryStatus === 'Assigned' && (
                                <button
                                    onClick={() => updateStatus('PickedUp')}
                                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-[0_4px_20px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span>Swipe to Pickup</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            )}

                            {activeOrder.deliveryStatus === 'PickedUp' && (
                                <>
                                    {activeOrder.paymentMethod === 'cod' && !activeOrder.moneyCollected ? (
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Collect ₹${activeOrder.totalAmount} Cash?`)) {
                                                    setActiveOrder(prev => ({ ...prev, moneyCollected: true }));
                                                }
                                            }}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg shadow-[0_4px_20px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all animate-pulse"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <span>💵 Collect ₹{activeOrder.totalAmount}</span>
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => updateStatus('Delivered')}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5E00] to-orange-500 text-white font-bold text-lg shadow-[0_4px_20px_rgba(249,115,22,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <span>Complete Delivery</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative min-h-[70vh] flex flex-col">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h2 className="text-xl font-black text-white tracking-tight">Nearby Orders</h2>
                        {isOnline && (
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5E00] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF5E00]"></span>
                                </span>
                                <span className="text-[10px] font-bold text-[#FF5E00] uppercase tracking-wider">Scanning</span>
                            </div>
                        )}
                    </div>

                    {!isOnline ? (
                        <div className="flex flex-1 flex-col items-center justify-center text-center p-6 bg-[#111] rounded-[40px] border border-white/5 shadow-2xl mt-4">
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                                <div className="absolute inset-4 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10">
                                    <span className="text-4xl">😴</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3">You're Offline</h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-[240px] mx-auto mb-8">
                                Go online to start receiving delivery requests and earning money.
                            </p>
                            <button
                                onClick={toggleStatus}
                                className="w-full max-w-xs py-4 bg-white text-black font-black rounded-2xl text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                            >
                                GO ONLINE
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-20 mt-4">
                            {availableOrders.filter(o => !rejectedOrderIds.includes(o._id)).length === 0 ? (
                                <div className="flex flex-1 flex-col items-center justify-center py-24">
                                    <div className="relative w-24 h-24 mb-6">
                                        <div className="absolute inset-0 border-4 border-[#FF5E00]/20 rounded-full animate-ping [animation-duration:2s]"></div>
                                        <div className="absolute inset-0 border-4 border-[#FF5E00]/40 rounded-full animate-ping [animation-duration:1.5s]"></div>
                                        <div className="absolute inset-8 bg-[#FF5E00] rounded-full shadow-[0_0_30px_#FF5E00] animate-pulse"></div>
                                    </div>
                                    <p className="text-gray-400 font-bold text-sm tracking-wide">SEARCHING FOR ORDERS...</p>
                                    <p className="text-gray-600 text-xs mt-2">Stay in high demand areas</p>
                                </div>
                            ) : (
                                availableOrders.filter(o => !rejectedOrderIds.includes(o._id)).map((order, i) => (
                                    <div
                                        key={order._id}
                                        className="bg-[#151515] p-5 rounded-[28px] border border-white/5 active:scale-[0.98] transition-all relative overflow-hidden group shadow-lg animate-in slide-in-from-bottom-8 fill-mode-backwards"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        {/* Abstract Card Decoration */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none"></div>

                                        <div className="flex justify-between items-start mb-5 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-[#222] flex items-center justify-center text-3xl shadow-inner border border-white/5">
                                                    🍔
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-2xl font-black text-white">₹{order.totalAmount}</h3>
                                                        <span className="bg-[#FF5E00]/10 text-[#FF5E00] text-[10px] font-bold px-2 py-0.5 rounded uppercase">{order.items.length} Items</span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 2.5km Total Distance
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mb-5">
                                            <div className="flex-1 bg-[#1a1a1a] rounded-xl p-3 border border-white/5">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Pickup</p>
                                                <p className="text-xs font-bold text-gray-200">Restaurant A</p>
                                            </div>
                                            <div className="flex-1 bg-[#1a1a1a] rounded-xl p-3 border border-white/5">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Drop</p>
                                                <p className="text-xs font-bold text-gray-200">Customer</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-[auto_1fr] gap-3">
                                            <button
                                                onClick={() => setRejectedOrderIds(prev => [...prev, order._id])}
                                                className="w-14 h-14 rounded-2xl bg-[#222] text-gray-400 flex items-center justify-center border border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => acceptOrder(order._id)}
                                                className="h-14 rounded-2xl bg-white text-black font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                                            >
                                                Accept Order
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Premium Contact Sheet */}
            {selectedContact && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-[#111] w-full max-w-md rounded-t-[40px] p-8 border-t border-white/10 relative animate-in slide-in-from-bottom duration-300 shadow-2xl">
                        <div className="w-16 h-1 bg-white/10 rounded-full mx-auto mb-8"></div>

                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-tr from-[#FF5E00] to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-[0_0_40px_rgba(255,94,0,0.3)] border-4 border-[#111]">
                                📞
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">{selectedContact.name}</h3>
                            <p className="text-gray-500 text-sm font-medium mb-8">Customer Contact</p>

                            <div className="bg-[#050505] rounded-3xl p-6 border border-white/5 mb-8 flex items-center justify-center gap-3">
                                <span className="text-3xl font-mono text-white font-bold tracking-widest">{selectedContact.phone}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="col-span-1 py-4 bg-[#222] text-white font-bold rounded-2xl active:scale-95 transition-all outline-none"
                                >
                                    Cancel
                                </button>
                                <a
                                    href={`tel:${selectedContact.phone}`}
                                    className="col-span-1 flex items-center justify-center py-4 bg-[#FF5E00] text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(255,94,0,0.4)] active:scale-95 transition-all outline-none"
                                >
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryDashboard;
