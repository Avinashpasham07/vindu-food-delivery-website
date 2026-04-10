import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import OrderService from '../../services/order.service';
import { useTranslation } from 'react-i18next';
import OrderMap from '../../components/OrderMap';
import toast from 'react-hot-toast';
import ChatWindow from '../../components/ChatWindow';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const socket = io(socketUrl);

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0); 
    const [riderLocation, setRiderLocation] = useState(null);
    const [roadStats, setRoadStats] = useState({ distance: 0, eta: 0, isRoadAware: false });
    const [isSimulating, setIsSimulating] = useState(false);

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

        socket.on('driver-location-updated', (location) => {
            console.log("Live Location Received:", location);
            setRiderLocation(location);
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


    const calculateHaversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // New: Fetch actual road distance from OSRM
    const fetchRoadDistance = async (start, end) => {
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;
            const resp = await fetch(url);
            const data = await resp.json();
            if (data.routes && data.routes.length > 0) {
                const distanceKm = data.routes[0].distance / 1000;
                // OSRM duration is in seconds
                const durationMins = Math.ceil(data.routes[0].duration / 60);
                return { distance: distanceKm, eta: durationMins };
            }
        } catch (err) {
            console.error("OSRM Route Error:", err);
        }
        // Fallback to Haversine
        const havDist = calculateHaversine(start.lat, start.lng, end.lat, end.lng);
        return { distance: havDist, eta: Math.ceil(havDist * 4 + 10), isFallback: true };
    };

    // Update Road Stats whenever mission state changes
    useEffect(() => {
        const updateStats = async () => {
            if (!order?.restaurantLocation?.lat || !order?.customerLocation?.lat) return;

            let start = order.restaurantLocation;
            let end = order.customerLocation;

            // If rider is out for delivery, track from rider to customer
            if (order.deliveryStatus === 'Out_for_Delivery' && riderLocation?.lat) {
                start = riderLocation;
            }

            const stats = await fetchRoadDistance(start, end);
            setRoadStats({
                distance: stats.distance,
                eta: stats.eta,
                isRoadAware: !stats.isFallback
            });
        };

        updateStats();
    }, [order?.restaurantLocation, order?.customerLocation, order?.deliveryStatus, riderLocation]);

    const fetchOrderDetails = async () => {
        try {
            const data = await OrderService.getOrderDetails(orderId);
            setOrder(data);
            setRiderLocation(data.riderLocation || data.restaurantLocation);
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

    // --- Simulation Logic ---
    const startSimulation = () => {
        if (!order?.restaurantLocation?.lat || !order?.customerLocation?.lat) {
            toast.error("Real coordinates missing for tracking!");
            return;
        }

        setIsSimulating(true);
        let step = 0;
        const totalSteps = 20;
        
        const interval = setInterval(() => {
            step++;
            const lat = order.restaurantLocation.lat + (order.customerLocation.lat - order.restaurantLocation.lat) * (step / totalSteps);
            const lng = order.restaurantLocation.lng + (order.customerLocation.lng - order.restaurantLocation.lng) * (step / totalSteps);
            
            socket.emit('update-location', {
                orderId,
                location: { lat, lng }
            });

            if (step >= totalSteps) {
                clearInterval(interval);
                setIsSimulating(false);
            }
        }, 1500);
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

    // Use Road Stats
    const totalDistance = roadStats.distance;
    const remainingDistance = roadStats.distance;
    const eta = roadStats.eta;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] relative pb-20 selection:bg-[#FF5E00]/30 flex flex-col overflow-hidden">

            {/* Header Actions */}
            <div className="p-4 flex justify-between items-center absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
                <button onClick={() => navigate('/home')} className="w-10 h-10 pointer-events-auto bg-[#111]/80 backdrop-blur rounded-full flex items-center justify-center border border-white/10 shadow-lg active:scale-95 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    {/* Gold Priority Badge */}
                    {JSON.parse(localStorage.getItem('user') || '{}').isGoldMember && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-gradient rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-white/20 animate-pulse">
                            <span className="text-black text-[9px] font-black uppercase tracking-tighter">Priority Dispatch</span>
                            <span className="text-black text-[10px]">✨</span>
                        </div>
                    )}
                    <div className="px-4 py-1.5 bg-[var(--accent)] rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-[var(--accent-glow)]">
                        {t(order.deliveryStatus?.toLowerCase() || 'order_placed')}
                    </div>
                </div>
            </div>

            {/* Real Map Area */}
            <div className="flex-1 relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-[#1a1a1a]">
                {(!order?.restaurantLocation?.lat && !order?.customerLocation?.lat) && (
                    <div className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                            <span className="text-3xl">📍</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Tracking Unavailable</h3>
                        <p className="text-gray-400 text-sm max-w-xs">
                            GPS coordinates for this order were not captured. Please contact support.
                        </p>
                    </div>
                )}
                
                {/* Warning for partial data */}
                {((!order?.restaurantLocation?.lat && order?.customerLocation?.lat) || (order?.restaurantLocation?.lat && !order?.customerLocation?.lat)) && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[2000] bg-yellow-500/20 backdrop-blur border border-yellow-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                        <span className="text-sm text-yellow-500 font-bold">⚠️ Partial Tracking Data</span>
                    </div>
                )}

                <OrderMap 
                    restaurant={order.restaurantLocation}
                    customer={order.customerLocation}
                    rider={riderLocation}
                />

                {/* Simulation Button Overlay */}
                {order?.restaurantLocation?.lat && (
                    <div className="absolute bottom-10 right-6 z-[1000]">
                        <button 
                            onClick={startSimulation}
                            disabled={isSimulating}
                            className={`px-4 py-2 rounded-xl border border-white/10 font-bold text-xs shadow-2xl backdrop-blur-md transition-all active:scale-95 ${isSimulating ? 'bg-orange-500/20 text-orange-400' : 'bg-[#111]/80 text-white hover:bg-[#FF5E00]'}`}
                        >
                            {isSimulating ? '🛰️ Tracking Active...' : '📍 Simulate Rider'}
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Sheet (Details) */}
            <div className="bg-[#111] border-t border-white/10 rounded-t-[32px] p-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] animate-slide-up z-10 relative -mt-6">

                {/* ETA Header */}
                <div className="flex justify-between items-end mb-8 bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    {/* Progress Background */}
                    <div className="absolute top-0 left-0 bottom-0 bg-[#FF5E00]/5 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    
                    <div className="relative z-10">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{t('estimated_arrival')}</p>
                        <h2 className="text-4xl font-black text-white leading-none">
                            {order.deliveryStatus === 'Delivered' ? '0' : eta} 
                            <span className="text-lg text-gray-500 font-bold ml-1">{t('min')}</span>
                        </h2>
                    </div>
                    <div className="text-right relative z-10">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                            {order.deliveryStatus === 'Out_for_Delivery' ? 'Remaining Distance' : 'Total Distance'}
                        </p>
                        <p className="text-white text-xl font-black">
                            {(order.deliveryStatus === 'Out_for_Delivery' ? remainingDistance : totalDistance).toFixed(1)} 
                            <span className="text-xs text-gray-500 uppercase ml-1">km</span>
                        </p>
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
                                <p className="text-sm font-bold">{t('order_placed')}</p>
                                <p className="text-[10px] opacity-60">{t('order_placed_desc')}</p>
                            </div>
                        </div>
                        {/* Step 2: Preparing */}
                        <div className="flex items-center gap-4 relative">
                            <div className={`w-5 h-5 rounded-full z-10 border-4 border-[#111] ${getStepStatus('Preparing') === 'completed' ? 'bg-[#FF5E00]' : 'bg-gray-700'}`}></div>
                            <div className={getStepStatus('Preparing') === 'completed' ? 'text-white' : 'text-gray-500'}>
                                <p className="text-sm font-bold">{t('preparing')}</p>
                                <p className="text-[10px] opacity-60">{t('preparing_desc')}</p>
                            </div>
                        </div>
                        {/* Step 3: Out for Delivery */}
                        <div className="flex items-center gap-4 relative">
                            <div className={`w-5 h-5 rounded-full z-10 border-4 border-[#111] animate-pulse ${getStepStatus('Out_for_Delivery') === 'completed' ? 'bg-[#FF5E00]' : 'bg-gray-700'}`}></div>
                            <div className={getStepStatus('Out_for_Delivery') === 'completed' ? 'text-white' : 'text-gray-500'}>
                                <p className="text-sm font-bold">{t('out_for_delivery')}</p>
                                <p className="text-[10px] opacity-60">{t('out_for_delivery_desc')}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Restaurant Info */}
                <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-[#FF5E00]/30 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                            🍳
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[#FF5E00] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Coming From</p>
                            <h3 className="text-white font-bold truncate">
                                {order.items?.[0]?.foodId?.foodpartner?.businessName || 'Vindu Restaurant'}
                            </h3>
                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                                {order.items?.[0]?.foodId?.foodpartner?.address || 'Address updating...'}
                            </p>
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
                        {t('searching_driver')}
                    </div>
                )}

                {/* Cancel Order (Only if not picked up) */}
                {order.deliveryStatus === 'Searching' && (
                    <button className="w-full mt-4 py-3 text-red-500 font-bold text-sm hover:bg-red-500/10 rounded-xl transition-colors">
                        {t('cancel_order')}
                    </button>
                )}
            </div>
 
            {/* Chat Overlay */}
            <ChatWindow 
                orderId={orderId} 
                currentUser={JSON.parse(localStorage.getItem('user') || '{}')} 
                senderModel="User"
            />
        </div>
    );
};

export default OrderTracking;
