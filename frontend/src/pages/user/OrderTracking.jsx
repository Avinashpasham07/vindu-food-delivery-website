import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import OrderService from '../../services/order.service';
import mapBackground from '../../assets/map_background.png'; // Import the simulated map image

const socket = io('http://localhost:3000');

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0); // 0 to 100 for rider position

    useEffect(() => {
        fetchOrderDetails();

        socket.emit('join_order_room', orderId);

        socket.on('order-updated', (updatedOrder) => {
            if (updatedOrder._id === orderId) {
                setOrder(updatedOrder);
                updateProgress(updatedOrder.deliveryStatus);
            }
        });

        socket.on('delivery-status-changed', ({ orderId: id, status }) => {
            if (id === orderId) {
                setOrder(prev => ({ ...prev, deliveryStatus: status }));
                updateProgress(status);
            }
        });

        return () => {
            socket.off('order-updated');
            socket.off('delivery-status-changed');
        };
    }, [orderId]);

    // Update rider progress based on status
    const updateProgress = (status) => {
        let targetProgress = 0;
        switch (status) {
            case 'Placed': targetProgress = 0; break;
            case 'Confirmed': targetProgress = 10; break;
            case 'Preparing': targetProgress = 50; break;
            case 'Out_for_Delivery': targetProgress = 0; break; // Start from Restaurant (0) for animation
            case 'Delivered': targetProgress = 100; break;
            default: targetProgress = 0;
        }

        // If it's not animated by useEffect, set it directly
        if (status !== 'Out_for_Delivery') {
            setProgress(targetProgress);
        }
    };

    // Better Simulation Effect with useEffect
    useEffect(() => {
        if (order?.deliveryStatus === 'Out_for_Delivery') {
            setProgress(0); // Start at Restaurant
            // Total time: 15 seconds
            // Update interval: 50ms
            // Total steps: 15000 / 50 = 300 steps
            // Increment per step: 100 / 300 = 0.3333
            const increment = 100 / 300;

            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 100;
                    return prev + increment;
                });
            }, 50);
            return () => clearInterval(interval);
        } else if (order?.deliveryStatus === 'Delivered') {
            setProgress(100);
        } else if (order?.deliveryStatus === 'Preparing') {
            setProgress(50);
        } else if (order?.deliveryStatus === 'Confirmed') {
            setProgress(10);
        } else {
            setProgress(0);
        }
    }, [order?.deliveryStatus]);


    const fetchOrderDetails = async () => {
        try {
            const data = await OrderService.getOrderDetails(orderId);
            setOrder(data);
            setLoading(false);
            // Initial progress set
            if (data.deliveryStatus === 'Out_for_Delivery') setProgress(20);
            else if (data.deliveryStatus === 'Delivered') setProgress(100);
            else if (data.deliveryStatus === 'Preparing') setProgress(10);
        } catch (err) {
            console.error("Error fetching order:", err);
            setLoading(false);
        }
    };

    const getStepStatus = (step) => {
        const statusMap = {
            'Placed': 0, 'Confirmed': 1, 'Preparing': 2, 'Out_for_Delivery': 3, 'Delivered': 4
        };
        let currentStepIndex = 0;
        if (order?.deliveryStatus === 'Searching') currentStepIndex = 0;
        else if (order?.deliveryStatus === 'Assigned') currentStepIndex = 1;
        else if (order?.deliveryStatus === 'Picked_Up') currentStepIndex = 3;
        else if (order?.deliveryStatus === 'Delivered') currentStepIndex = 4;
        return currentStepIndex >= statusMap[step] ? 'completed' : 'pending';
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-[#FF5E00]/20 border-t-[#FF5E00] rounded-full animate-spin"></div>
        </div>
    );

    if (!order) return <div className="text-white text-center pt-20">Order not found.</div>;

    const DeliveryPartner = order.deliveryPartner;

    // Calculate Rider Position (Linear Interpolation)
    // Start (Restaurant): Left 20%, Top 60%
    // End (Home): Left 80%, Top 30%
    const startX = 20; const endX = 80;
    const startY = 60; const endY = 30;

    const riderLeft = startX + (endX - startX) * (progress / 100);
    const riderTop = startY + (endY - startY) * (progress / 100);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] relative pb-20 selection:bg-[#FF5E00]/30 flex flex-col overflow-hidden">

            {/* Header Actions */}
            <div className="p-4 flex justify-between items-center absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
                <button onClick={() => navigate('/')} className="w-10 h-10 pointer-events-auto bg-[#111]/80 backdrop-blur rounded-full flex items-center justify-center border border-white/10 shadow-lg active:scale-95 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div className="flex items-center gap-3">
                    <div id="live-signal" className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] opacity-50 transition-opacity duration-300" title="Live Signal"></div>
                    <div className="px-4 py-1.5 bg-[#FF5E00] rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20">
                        {order.deliveryStatus?.replace('_', ' ')}
                    </div>
                </div>
            </div>

            {/* Simulated Map Area */}
            <div className="flex-1 relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-[#1a1a1a]">
                {/* Background Image */}
                <img loading="lazy" src={mapBackground} alt="Map Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />

                {/* Path Line (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <line
                        x1="20%" y1="60%"
                        x2="80%" y2="30%"
                        stroke="#FF5E00"
                        strokeWidth="4"
                        strokeDasharray="10,10"
                        opacity="0.6"
                    />
                </svg>

                {/* Restaurant Marker */}
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10" style={{ left: '20%', top: '60%' }}>
                    <div className="w-10 h-10 bg-[#111] border-2 border-gray-500 rounded-full flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                        👨‍🍳
                    </div>
                    <span className="mt-1 text-[10px] font-bold bg-black/50 px-2 rounded text-gray-300 backdrop-blur-sm">Restaurant</span>
                </div>

                {/* Home Marker */}
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10" style={{ left: '80%', top: '30%' }}>
                    <div className="w-10 h-10 bg-[#FF5E00] border-2 border-white rounded-full flex items-center justify-center text-xl shadow-[0_0_20px_rgba(255,94,0,0.6)] animate-pulse">
                        🏠
                    </div>
                    <span className="mt-1 text-[10px] font-bold bg-black/50 px-2 rounded text-white backdrop-blur-sm">Home</span>
                </div>

                {/* Animated Rider */}
                <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 ease-linear will-change-transform"
                    style={{ left: `${riderLeft}%`, top: `${riderTop}%` }}
                >
                    <div className="w-12 h-12 bg-white rounded-full border-4 border-[#FF5E00] flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(255,94,0,0.5)]">
                        🛵
                    </div>
                    {/* Label below rider */}
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap">
                        {order.deliveryStatus === 'Out_for_Delivery' ? 'On the way' : 'Waiting...'}
                    </div>
                </div>

            </div>

            {/* Bottom Sheet (Details) */}
            <div className="bg-[#111] border-t border-white/10 rounded-t-[32px] p-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] animate-slide-up z-10 relative -mt-6">

                {/* ETA Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Estimated Arrival</p>
                        <h2 className="text-4xl font-black text-white">35 <span className="text-xl text-gray-500 font-bold">min</span></h2>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Order ID</p>
                        <p className="text-white font-mono font-bold">#{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div className="mb-8 relative pl-2">
                    {/* Vertical Line */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-white/10"></div>

                    <div className="space-y-6">
                        {/* Step 1: Placed */}
                        <div className="flex items-center gap-4 relative">
                            <div className={`w-5 h-5 rounded-full z-10 border-4 border-[#111] ${getStepStatus('Placed') === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                            <div className={getStepStatus('Placed') === 'completed' ? 'text-white' : 'text-gray-500'}>
                                <p className="text-sm font-bold">Order Placed</p>
                                <p className="text-[10px] opacity-60">We have received your order.</p>
                            </div>
                        </div>
                        {/* Step 2: Preparing */}
                        <div className="flex items-center gap-4 relative">
                            <div className={`w-5 h-5 rounded-full z-10 border-4 border-[#111] ${getStepStatus('Preparing') === 'completed' ? 'bg-[#FF5E00]' : 'bg-gray-700'}`}></div>
                            <div className={getStepStatus('Preparing') === 'completed' ? 'text-white' : 'text-gray-500'}>
                                <p className="text-sm font-bold">Preparing Details</p>
                                <p className="text-[10px] opacity-60">Kitchen is preparing your food.</p>
                            </div>
                        </div>
                        {/* Step 3: Out for Delivery */}
                        <div className="flex items-center gap-4 relative">
                            <div className={`w-5 h-5 rounded-full z-10 border-4 border-[#111] animate-pulse ${getStepStatus('Out_for_Delivery') === 'completed' ? 'bg-[#FF5E00]' : 'bg-gray-700'}`}></div>
                            <div className={getStepStatus('Out_for_Delivery') === 'completed' ? 'text-white' : 'text-gray-500'}>
                                <p className="text-sm font-bold">Out for Delivery</p>
                                <p className="text-[10px] opacity-60">Driver is on the way.</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Driver Card */}
                {DeliveryPartner ? (
                    <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#FF5E00] to-yellow-500">
                                <div className="w-full h-full rounded-full bg-[#222] flex items-center justify-center font-bold text-lg text-white">
                                    {DeliveryPartner.fullname.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <p className="text-white font-bold">{DeliveryPartner.fullname}</p>
                                <p className="text-xs text-gray-500 font-bold uppercase">Delivery Partner</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-yellow-500 text-xs">★ 4.8</span>
                                    <span className="text-gray-600 text-[10px]">• 500+ Trips</span>
                                </div>
                            </div>
                        </div>
                        <a href={`tel:${DeliveryPartner.phone}`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors shadow-lg">
                            📞
                        </a>
                    </div>
                ) : (
                    <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 flex items-center justify-center text-gray-500 text-sm font-medium animate-pulse">
                        Searching for nearby drivers...
                    </div>
                )}

                {/* Cancel Order (Only if not picked up) */}
                {order.deliveryStatus === 'Searching' && (
                    <button className="w-full mt-4 py-3 text-red-500 font-bold text-sm hover:bg-red-500/10 rounded-xl transition-colors">
                        Cancel Order
                    </button>
                )}

            </div>
        </div>
    );
};

export default OrderTracking;
