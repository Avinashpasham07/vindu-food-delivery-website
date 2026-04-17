import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/client';
import { io } from 'socket.io-client';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import L from 'leaflet';
import { Building, Home, Phone, Banknote, Sparkles, TrendingUp, Bike, ShoppingBag, Trophy, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import ChatWindow from '../../components/ChatWindow';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://vindu-food-delivery.onrender.com';
const socket = io(socketUrl);



const SwipeToAccept = ({ onAccept, text = "Swipe to Accept Mission" }) => {
    const [isSwiping, setIsSwiping] = useState(false);
    const [sliderX, setSliderX] = useState(0);
    const containerRef = React.useRef(null);

    const handleStart = () => setIsSwiping(true);
    const handleEnd = () => {
        if (!isSwiping) return;
        setIsSwiping(false);
        if (sliderX > 200) {
            onAccept();
        } else {
            setSliderX(0);
        }
    };

    const handleMove = (e) => {
        if (!isSwiping) return;
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const rect = containerRef.current.getBoundingClientRect();
        const delta = Math.max(0, Math.min(clientX - rect.left - 40, rect.width - 100));
        setSliderX(delta);
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-24 bg-white/5 border border-white/10 rounded-[30px] flex items-center p-2 cursor-grab active:cursor-grabbing overflow-hidden select-none"
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-black text-white/20 uppercase tracking-[0.3em] italic">{text}</span>
            </div>
            
            <div 
                className="absolute inset-0 bg-gradient-to-r from-[#FF5E00]/20 to-transparent transition-opacity"
                style={{ opacity: sliderX / 200 }}
            ></div>

            <div 
                className="h-20 w-24 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl z-10 transition-transform duration-75"
                style={{ transform: `translateX(${sliderX}px)` }}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
            >
                <ChevronRight className="w-8 h-8 animate-pulse" strokeWidth={3} />
            </div>
        </div>
    );
};

const RoutingMachine = createControlComponent(({ pickup, dropoff }) => {
    return L.Routing.control({
        waypoints: [L.latLng(pickup), L.latLng(dropoff)],
        lineOptions: {
            styles: [
                { color: '#FF5E00', weight: 8, opacity: 0.3 }, // Glow
                { color: '#FF5E00', weight: 4, opacity: 1, dashArray: '10, 10' } // Core
            ]
        },
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        createMarker: () => null // Hide default markers, we use our custom icons
    });
});

const MissionMap = ({ stops = [], customerLoc }) => {
    // Defensive check for coordinate validity
    const isValid = (loc) => {
        if (!loc) return false;
        const lat = parseFloat(loc.lat);
        const lng = parseFloat(loc.lng);
        return !isNaN(lat) && !isNaN(lng);
    };

    const stopCoords = stops.filter(isValid).map(s => [parseFloat(s.lat), parseFloat(s.lng)]);
    const dropoffCoords = isValid(customerLoc)
        ? [parseFloat(customerLoc.lat), parseFloat(customerLoc.lng)]
        : [17.3950, 78.4967];

    // If no stops, use a fallback
    const startCoords = stopCoords.length > 0 ? stopCoords[0] : [17.3850, 78.4867];
 
    const center = [(startCoords[0] + dropoffCoords[0]) / 2, (startCoords[1] + dropoffCoords[1]) / 2];
 
    const pickupIcon = new L.DivIcon({
        html: `<div style="background-color: #FF5E00; border: 2px solid white; border-radius: 12px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 0 15px rgba(255,94,0,0.5); transform: rotate(45deg);"><div style="transform: rotate(-45deg);">🏢</div></div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
 
    const dropoffIcon = new L.DivIcon({
        html: `<div style="background-color: #111; border: 2px solid #FF5E00; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 0 20px rgba(255,94,0,0.3);">🏠</div>`,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    return (
        <div className="w-full h-[400px] rounded-[40px] overflow-hidden border border-white/10 shadow-3xl bg-[#050505] relative group">
            <div className="absolute top-6 left-6 z-[100] bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
                <div className="w-2 h-2 bg-[#FF5E00] rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">GPS ROUTING: ACTIVE</span>
            </div>

            <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    attribution='&copy; Google Maps'
                />
                
                {stopCoords.length > 0 && isValid(customerLoc) && (
                    <Polyline
                        positions={[...stopCoords, dropoffCoords]}
                        color="#FF5E00"
                        weight={4}
                        opacity={0.5}
                        dashArray="10, 10"
                    />
                )}
                
                {stopCoords.length > 0 && (
                    <RoutingMachine 
                        pickup={stopCoords[0]} 
                        dropoff={dropoffCoords} 
                        // Note: Leaflet Routing Machine supports waypoints, 
                        // we can pass all stopCoords as intermediates if needed
                    />
                )}
                
                {stops.map((stop, idx) => (
                    isValid(stop) && (
                        <Marker key={`stop-${idx}`} position={[parseFloat(stop.lat), parseFloat(stop.lng)]} icon={pickupIcon}>
                            <Popup>{stop.name || `Pickup ${idx + 1}`}</Popup>
                        </Marker>
                    )
                ))}

                {isValid(customerLoc) && (
                    <Marker position={[parseFloat(customerLoc.lat), parseFloat(customerLoc.lng)]} icon={dropoffIcon}>
                        <Popup>Target Dropoff</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

const DeliveryDashboard = () => {
    const [partner, setPartner] = useState(JSON.parse(localStorage.getItem('deliveryPartner')));
    const [availableOrders, setAvailableOrders] = useState([]);
    const [history, setHistory] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [rejectedOrderIds, setRejectedOrderIds] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedBriefing, setSelectedBriefing] = useState(null);
    const [stats, setStats] = useState({ totalEarnings: 0, totalDeliveries: 0, todayEarnings: 0, todayDeliveries: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        if (!partner) {
            navigate('/delivery/login');
            return;
        }

        socket.emit('join_delivery');
        fetchOrders();
        fetchCurrentOrder();
        fetchStats();

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
            const res = await apiClient.get('/delivery/orders/available');
            setAvailableOrders(res.data.orders);
        } catch (err) { console.error(err); }
    };

    const fetchCurrentOrder = async () => {
        try {
            const res = await apiClient.get('/delivery/orders/current');
            if (res.data.order) {
                setActiveOrder(res.data.order);
                setIsOnline(false);
            }
        } catch (err) { console.error(err); }
    };

    const fetchStats = async () => {
        try {
            const res = await apiClient.get('/delivery/history');
            if (res.data.stats) setStats(res.data.stats);
            if (res.data.history) setHistory(res.data.history.slice(0, 3));
        } catch (err) { console.error(err); }
    };

    const toggleStatus = async () => {
        try {
            const newStatus = isOnline ? 'offline' : 'online';
            await apiClient.post('/delivery/toggle-status', { status: newStatus });
            setIsOnline(!isOnline);
        } catch (err) { console.error(err); }
    };

    const acceptOrder = async (orderId) => {
        try {
            const res = await apiClient.post('/delivery/orders/accept', { orderId });
            setActiveOrder(res.data.order);
            setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
            setIsOnline(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Error accepting order');
            fetchOrders();
        }
    };

    const updateStatus = async (status, stopPartnerId = null) => {
        try {
            const res = await apiClient.put('/delivery/orders/status', { 
                orderId: activeOrder._id, 
                status,
                stopPartnerId 
            });
            setActiveOrder(res.data.order);
            if (status === 'Delivered') {
                setActiveOrder(null);
                fetchStats();
                setIsOnline(true);
            }
        } catch (err) { console.error(err); }
    };

    const filteredOrders = useMemo(() => {
        return availableOrders.filter(o => !rejectedOrderIds.includes(o._id));
    }, [availableOrders, rejectedOrderIds]);

    if (!partner) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] relative pb-20 selection:bg-[#FF5E00]/30 selection:text-[#FF5E00]">
            {/* Animated Grid Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,94,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,94,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[800px] bg-[#FF5E00]/10 rounded-full blur-[150px] opacity-30"></div>
            </div>

            {/* Floating Top Navbar - Truly Wide */}
            <div className="fixed top-0 left-0 right-0 z-[100] px-4 pt-6 pb-10 bg-gradient-to-b from-[#050505] to-transparent">
                <div className="w-full max-w-[1400px] mx-auto bg-[#111]/80 backdrop-blur-3xl border border-white/10 rounded-[35px] p-3 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                    <div onClick={() => navigate('/delivery/profile')} className="flex items-center gap-4 pl-4 cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5E00] to-orange-400 p-[2px]">
                            <div className="w-full h-full rounded-2xl bg-[#111] flex items-center justify-center font-black text-xl text-white group-hover:bg-transparent transition-all">
                                {partner.fullname.charAt(0)}
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">PRO FLEET COMMANDER</p>
                            <p className="text-sm font-black text-white">{partner.fullname}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pr-2">
                        <div className="bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5 text-right hidden xs:block">
                            <p className="text-[9px] font-black text-[#FF5E00] uppercase tracking-widest leading-none mb-1">Today's Revenue</p>
                            <p className="text-lg font-black text-white leading-none">₹{stats.todayEarnings}</p>
                        </div>
                        <button
                            onClick={toggleStatus}
                            disabled={!!activeOrder}
                            className={`h-12 px-8 rounded-2xl flex items-center gap-3 text-xs font-black transition-all ${isOnline
                                ? 'bg-green-500 text-black shadow-[0_0_35px_rgba(34,197,94,0.4)]'
                                : 'bg-[#222] text-gray-400 border border-white/5'
                                } ${activeOrder ? 'opacity-50 grayscale' : 'hover:scale-105 active:scale-95'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-black animate-pulse' : 'bg-red-500'}`}></div>
                            {isOnline ? 'ONLINE' : 'GO ONLINE'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Expansive Wide Grid */}
            <main className="pt-32 pb-10 px-6 w-full max-w-[1400px] mx-auto min-h-screen flex flex-col gap-10">
                
                {activeOrder ? (
                    /* MISSION UI (Active) - Wide Split Layout */
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom duration-700">
                        {/* Status Sidebar */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 shadow-2xl">
                                <span className="bg-[#FF5E00]/10 text-[#FF5E00] text-[10px] font-black px-3 py-1 rounded tracking-[0.2em] uppercase">Active Mission</span>
                                <h1 className="text-5xl font-black tracking-tighter text-white mt-4 mb-2">Ongoing</h1>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Order #{activeOrder._id.slice(-6).toUpperCase()}</p>
                                
                                <div className="mt-10 py-6 border-y border-white/5 flex justify-between items-center">
                                    <p className="text-gray-400 font-bold">Base Fee</p>
                                    <p className="text-4xl font-black text-white">₹{activeOrder.totalAmount}</p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-gray-400 font-bold">Stops</p>
                                    <p className="text-2xl font-black text-[#FF5E00]">{activeOrder.restaurantStops?.length || 1}</p>
                                </div>
                            </div>
                            
                            <div className="bg-[#111] border border-white/5 rounded-[40px] p-8">
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 text-center">Mission Progress</p>
                                <div className="space-y-6">
                                    {['Assigned', 'PickedUp', 'Delivered'].map((step, idx) => (
                                        <div key={step} className="flex items-center gap-4">
                                            <div className={`w-4 h-4 rounded-full border-4 ${
                                                activeOrder.deliveryStatus === step || (idx === 0 && activeOrder.deliveryStatus === 'PickedUp') || (idx < 2 && activeOrder.deliveryStatus === 'Delivered')
                                                ? 'bg-[#FF5E00] border-[#FF5E00]/30' 
                                                : 'bg-white/5 border-transparent'
                                            }`}></div>
                                            <p className={`text-xs font-black uppercase tracking-widest ${idx > 0 && activeOrder.deliveryStatus === 'Assigned' ? 'text-gray-700' : 'text-gray-300'}`}>{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Control Center */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-4">Pickup Itinerary</h3>
                            {activeOrder.restaurantStops?.map((stop, idx) => (
                                <div 
                                    key={idx}
                                    className={`w-full bg-[#111] border rounded-[45px] p-8 transition-all duration-500 shadow-2xl ${stop.status === 'Pending' ? 'border-[#FF5E00] shadow-[0_20px_80px_rgba(255,94,0,0.15)]' : 'border-white/5 opacity-40'}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
                                                {stop.status === 'PickedUp' ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <Building className="w-8 h-8 text-[#FF5E00]" />}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white italic uppercase">{stop.name}</h3>
                                                <p className="text-gray-500 font-bold text-xs mt-1">{stop.location?.address || "Pickup Location"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => setSelectedContact({ 
                                                    name: stop.name, 
                                                    phone: 'Contact Provider' 
                                                })} 
                                                className="w-12 h-12 bg-[#FF5E00]/10 text-[#FF5E00] border border-[#FF5E00]/20 rounded-2xl flex items-center justify-center text-xl shadow-lg active:scale-95 transition-all hover:bg-[#FF5E00] hover:text-white"
                                            >
                                                <Phone className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                    {stop.status === 'Pending' && (
                                        <button 
                                            onClick={() => updateStatus('PickedUp', stop.partnerId)} 
                                            className="w-full py-4 bg-white text-black font-black rounded-2xl text-lg hover:scale-[1.01] active:scale-95 transition-all shadow-xl uppercase"
                                        >
                                            Pick Up from {stop.name}
                                        </button>
                                    )}
                                </div>
                            ))}

                            <div className={`w-full bg-[#111] border rounded-[45px] p-10 transition-all duration-500 shadow-2xl ${activeOrder.deliveryStatus === 'PickedUp' ? 'border-[#FF5E00] shadow-[0_20px_80px_rgba(255,94,0,0.15)]' : 'border-white/5 opacity-40'}`}>
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-3xl bg-[#FF5E00]/10 flex items-center justify-center text-4xl"><Home className="w-8 h-8 text-[#FF5E00]" /></div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">DROP: {activeOrder.userId?.fullname}</h3>
                                            <p className="text-gray-500 font-bold text-sm mt-1">{activeOrder.address?.address || activeOrder.address?.street}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedContact({ name: activeOrder.userId?.fullname, phone: activeOrder.userId?.phone })} className="w-14 h-14 bg-green-500 text-black rounded-2xl flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-all"><Phone className="w-7 h-7" /></button>
                                </div>
                                {activeOrder.deliveryStatus === 'PickedUp' && (
                                    <button onClick={() => updateStatus('Delivered')} className="w-full py-6 bg-[#FF5E00] text-white font-black rounded-3xl text-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-xl uppercase">Mission Accomplished</button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* DASHBOARD HOME - Truly Wide Grid Layout */
                    <div className="flex flex-col gap-10">
                        
                        {/* Stats Hub - No empty space! */}
                        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top duration-700">
                            {[
                                { lab: 'Today Revenue', val: `₹${stats.todayEarnings}`, ico: <Banknote className="w-8 h-8 text-green-500" />, col: 'text-white' },
                                { lab: 'Missions Done', val: stats.todayDeliveries, ico: <Sparkles className="w-8 h-8 text-yellow-500" />, col: 'text-white' },
                                { lab: 'Lifetime Gain', val: `₹${stats.totalEarnings}`, ico: <TrendingUp className="w-8 h-8 text-blue-500" />, col: 'text-gray-500' },
                                { lab: 'Total Trips', val: stats.totalDeliveries, ico: <Bike className="w-8 h-8 text-gray-500" />, col: 'text-gray-500' }
                            ].map((s, i) => (
                                <div key={i} className="bg-[#111] border border-white/5 rounded-[35px] p-8 shadow-2xl relative overflow-hidden group hover:border-[#FF5E00]/20 transition-all">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-125 transition-transform">{s.ico}</div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{s.lab}</p>
                                    <h3 className={`text-4xl font-black ${s.col} tracking-tighter`}>{s.val}</h3>
                                </div>
                            ))}
                        </section>

                        {!isOnline ? (
                            /* OFFLINE VIEW - WIDE */
                            <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center text-center bg-[#111] border border-white/5 rounded-[60px] p-20 animate-fade-in shadow-2xl">
                                <div className="w-56 h-56 mb-12 relative">
                                    <div className="absolute inset-0 bg-[#FF5E00]/5 rounded-full animate-pulse-slow"></div>
                                    <div className="absolute inset-6 bg-[#050505] rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                                        <Bike className="w-24 h-24 text-gray-800 opacity-20" />
                                    </div>
                                </div>
                                <h2 className="text-6xl font-black tracking-tighter mb-6">Off The Grid</h2>
                                <p className="text-gray-500 font-bold mb-12 max-w-lg text-xl uppercase tracking-widest">Return online to begin high-value missions</p>
                                <button onClick={toggleStatus} className="px-20 py-7 bg-white text-black font-black rounded-[30px] text-2xl shadow-2xl hover:bg-[#FF5E00] hover:text-white transition-all transform hover:scale-105 active:scale-95">START YOUR SHIFT</button>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            /* RADAR VIEW - WIDE */
                            <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center bg-[#111] border border-white/5 rounded-[60px] p-20 shadow-2xl">
                                <div className="relative w-80 h-80 mb-20">
                                    <div className="absolute inset-0 border-2 border-[#FF5E00]/10 rounded-full animate-ping-slow"></div>
                                    <div className="absolute inset-[20%] border-2 border-[#FF5E00]/20 rounded-full animate-ping-slow [animation-delay:0.5s]"></div>
                                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,94,0,0.5)_90deg,transparent_91deg)] animate-spin-radar opacity-40"></div>
                                    <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#FF5E00] rounded-full flex items-center justify-center shadow-[0_0_80px_#FF5E00] z-10 transition-transform">
                                        <Bike className="w-10 h-10 text-white animate-bounce" />
                                    </div>
                                </div>
                                <h3 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Scanning For Pings</h3>
                                <p className="text-[#FF5E00] text-xs font-black uppercase tracking-[0.4em] opacity-60 animate-pulse">Establishing Mission Link...</p>
                            </div>
                        ) : (
                            /* MISSION GRID - 2 OR 3 PER ROW */
                            <div className="animate-in fade-in duration-500">
                                <div className="flex items-center justify-between mb-10 px-4">
                                    <h2 className="text-4xl font-black text-white italic">Active Pings</h2>
                                    <div className="bg-[#FF5E00] text-black text-xs font-black px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/20">
                                        {filteredOrders.length} MISSIONS AVAILABLE
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredOrders.map((order, i) => (
                                        <div
                                            key={order._id}
                                            className="bg-[#111] rounded-[50px] p-10 border border-white/5 relative overflow-hidden group shadow-2xl hover:border-[#FF5E00]/30 transition-all flex flex-col"
                                        >
                                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none text-9xl font-black italic -mr-8 -mt-8 uppercase">Fast</div>
                                            
                                            <div className="flex items-center gap-6 mb-10">
                                                <div className="w-20 h-20 rounded-[35px] bg-[#1a1a1a] flex items-center justify-center text-5xl shadow-inner border border-white/5 transition-transform group-hover:scale-110"><ShoppingBag className="w-10 h-10 text-[#FF5E00]" /></div>
                                                <div>
                                                    <h3 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">₹{order.totalAmount}</h3>
                                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                                        {order.items?.length || 1} Packages • {order.restaurantStops?.length || 1} Stops
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-black/40 rounded-[35px] p-7 mb-10 space-y-5 border border-white/5 flex-1">
                                                <div className="flex gap-5">
                                                    <div className="w-1.5 bg-gradient-to-b from-blue-500 to-[#FF5E00] rounded-full my-1"></div>
                                                    <div className="space-y-4 font-black tracking-tight overflow-hidden">
                                                        <p className="text-xs text-white opacity-90 truncate italic uppercase">
                                                            Pickups: {order.restaurantStops?.map(s => s.name).join(', ') || "Vindu Partners"}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate italic uppercase">Drop: {order.address?.address || order.address?.street || "Customer Residence"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button onClick={() => setSelectedBriefing(order)} className="w-full py-6 bg-white text-black font-black text-2xl rounded-[30px] shadow-2xl hover:bg-[#FF5E00] hover:text-white transition-all transform group-hover:scale-[1.02] active:scale-95 uppercase tracking-tighter">
                                                Review Mission
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity Log - Wide Grid */}
                        {isOnline && history.length > 0 && (
                            <div className="mt-10 mb-20 animate-in slide-in-from-bottom-8 duration-1000">
                                <h3 className="text-3xl font-black text-white italic mb-10 px-4">Latest Logs</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {history.map(order => (
                                        <div key={order._id} className="bg-[#1a1a1a] p-8 rounded-[40px] border border-white/5 flex items-center justify-between shadow-xl hover:bg-white/[0.03] transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl"><Trophy className="w-8 h-8 text-yellow-400" /></div>
                                                <div>
                                                    <p className="text-white text-lg font-black leading-none">{order.items[0]?.foodId?.foodpartner?.name || order.restaurantName || "Mission Victory"}</p>
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Success • ID: {order._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <p className="text-3xl font-black text-green-500">+₹{order.totalAmount || 40}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Mission Briefing Portal - NEW */}
            {selectedBriefing && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl p-6 lg:p-12 overflow-y-auto animate-in fade-in duration-500">
                    <div className="w-full max-w-[1400px] mx-auto min-h-full flex flex-col gap-10">
                        <header className="flex justify-between items-center">
                            <button onClick={() => setSelectedBriefing(null)} className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition-all">
                                <ArrowLeft className="w-8 h-8" />
                            </button>
                            <div className="text-right">
                                <p className="text-[#FF5E00] text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1 text-sky-400">Tactical Briefing</p>
                                <h1 className="text-4xl font-black text-white italic tracking-tighter">Mission #{selectedBriefing._id.slice(-6).toUpperCase()}</h1>
                            </div>
                        </header>

                        {/* Tactical Radar Display [NEW] */}
                        <MissionMap 
                            stops={selectedBriefing.restaurantStops?.map(s => ({ ...s.location, name: s.name }))} 
                            customerLoc={selectedBriefing.customerLocation} 
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* Mission Manifest */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="bg-[#111] border border-white/5 rounded-[60px] p-10 shadow-3xl">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-10 flex items-center gap-4">
                                        <span className="w-12 h-px bg-white/5"></span> Order Manifest <span className="flex-1 h-px bg-white/5"></span>
                                    </h3>
                                    <div className="space-y-6">
                                        {selectedBriefing.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-20 rounded-[35px] bg-[#1a1a1a] flex items-center justify-center text-4xl shadow-inner border border-white/5"><ShoppingBag className="w-10 h-10 text-[#FF5E00]" /></div>
                                                    <div>
                                                        <p className="text-xl font-black text-white leading-none mb-2">{item.foodId?.name || "Order Item"}</p>
                                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{item.quantity} Unit(s) • Handled with Care</p>
                                                    </div>
                                                </div>
                                                <p className="text-2xl font-black text-white opacity-20 group-hover:opacity-100 transition-opacity italic">x{item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-[#111] border border-white/5 rounded-[45px] p-10 shadow-xl">
                                        <p className="text-[10px] font-black text-[#FF5E00] uppercase tracking-widest mb-4">Pickup Point</p>
                                        <h4 className="text-2xl font-black text-white mb-2 italic uppercase">{selectedBriefing.items[0]?.foodId?.foodpartner?.name || "RESTAURANT"}</h4>
                                        <p className="text-gray-500 text-sm font-bold leading-relaxed">{selectedBriefing.items[0]?.foodId?.foodpartner?.address || "Mission Start Terminal"}</p>
                                    </div>
                                    <div className="bg-[#111] border border-white/5 rounded-[45px] p-10 shadow-xl">
                                        <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-4">Target Drop</p>
                                        <h4 className="text-2xl font-black text-white mb-2 italic uppercase">{selectedBriefing.userId?.fullname || "CIVILIAN"}</h4>
                                        <p className="text-gray-500 text-sm font-bold leading-relaxed">{selectedBriefing.address?.address || "Delivery Endpoint"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payout & Action */}
                            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-10">
                                <div className="bg-[#111] border border-[#FF5E00]/20 rounded-[60px] p-12 shadow-[0_40px_100px_rgba(255,94,0,0.1)] relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-9xl font-black italic -mr-4 -mt-4 uppercase">Win</div>
                                     <p className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-12 italic text-center">Estimated Earnings</p>
                                     <div className="text-center mb-12">
                                         <h2 className="text-9xl font-black text-white tracking-tighter mb-2 italic">₹{selectedBriefing.totalAmount}</h2>
                                         <p className="text-green-500 text-xs font-black uppercase tracking-widest">Base Fee + Instant Payout</p>
                                     </div>
                                     <div className="space-y-4 mb-16 px-6">
                                         <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-500">
                                             <span>Multi-Stop Bonus</span>
                                             <span className="text-white">+₹{Math.max(0, (selectedBriefing.restaurantStops?.length - 1) * 15)}</span>
                                         </div>
                                         <div className="h-px bg-white/5 w-full my-4"></div>
                                         <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-[#FF5E00]">
                                             <span>Net Payout</span>
                                             <span>₹{25 + Math.max(0, (selectedBriefing.restaurantStops?.length - 1) * 15)}</span>
                                         </div>
                                     </div>

                                     <SwipeToAccept 
                                        onAccept={() => {
                                            acceptOrder(selectedBriefing._id);
                                            setSelectedBriefing(null);
                                        }} 
                                        text="Slide to Authorize Mission"
                                     />
                                </div>
                                <p className="text-center text-[10px] font-black text-gray-700 uppercase tracking-widest px-10">
                                    By swiping, you commit to the Vindu Fleet agreement and guarantee a 30min delivery window.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-components: Contact Dialog */}
            {selectedContact && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-[#111] w-full max-w-lg rounded-[60px] p-12 border border-white/10 shadow-3xl relative animate-in zoom-in-95">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gradient-to-tr from-[#FF5E00] to-orange-400 rounded-full flex items-center justify-center mx-auto mb-10 text-6xl shadow-3xl border-[6px] border-[#111]"><Phone className="w-16 h-16 text-white" /></div>
                            <h3 className="text-5xl font-black text-white mb-4 tracking-tighter">{selectedContact.name}</h3>
                            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] mb-12">Secured Voice Terminal</p>

                            <div className="bg-black/50 border border-white/10 rounded-[40px] p-10 mb-12">
                                <span className="text-4xl font-mono text-white font-black tracking-widest">{selectedContact.phone}</span>
                            </div>

                            <a href={`tel:${selectedContact.phone}`} className="w-full py-7 bg-[#FF5E00] text-white font-black rounded-3xl text-3xl shadow-3xl transform hover:scale-105 active:scale-95 transition-all text-center block">VOICE CALL</a>
                            <button onClick={() => setSelectedContact(null)} className="mt-8 py-4 text-gray-700 font-bold hover:text-white uppercase text-xs tracking-widest transition-all">Dismiss Connection</button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin-radar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-radar { animation: spin-radar 3s linear infinite; }
                @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
                .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
                .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}} />
 
            {/* Chat Overlay for Active Mission */}
            {activeOrder && (
                <ChatWindow 
                    orderId={activeOrder._id} 
                    currentUser={JSON.parse(localStorage.getItem('deliveryPartner') || '{}')} 
                    senderModel="DeliveryPartner"
                />
            )}
        </div>
    );
};

export default DeliveryDashboard;
