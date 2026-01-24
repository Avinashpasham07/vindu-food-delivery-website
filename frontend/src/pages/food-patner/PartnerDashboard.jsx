import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import AnalyticsChart from '../../components/AnalyticsChart';
import TopItemsChart from '../../components/TopItemsChart';

// ... (inside component)

const PartnerDashboard = () => {
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null);
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'menu'

    // Calculate Dashboard Stats
    const calculateStats = () => {
        // 1. Revenue Chart Data (Hourly for Today)
        const revenueData = [];
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));

        // Initialize 12 AM to 11 PM
        for (let i = 0; i < 24; i++) {
            revenueData.push({
                name: i === 0 ? '12 AM' : i === 12 ? '12 PM' : i > 12 ? `${i - 12} PM` : `${i} AM`,
                hour: i,
                revenue: 0,
                orders: 0
            });
        }

        // 2. Top Items Data
        const itemCounts = {};

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);

            // Revenue Logic (Only for today's orders)
            if (new Date(order.createdAt) >= startOfDay) {
                const hour = orderDate.getHours();
                if (revenueData[hour]) {
                    revenueData[hour].revenue += order.totalAmount;
                    revenueData[hour].orders += 1;
                }
            }

            // Top Items Logic (All time)
            order.items.forEach(item => {
                if (itemCounts[item.name]) {
                    itemCounts[item.name] += item.quantity;
                } else {
                    itemCounts[item.name] = item.quantity;
                }
            });
        });

        // Filter out hours with 0 revenue to keep chart clean (optional, keeping for timeline consistency)
        // Let's just take the active hours range (e.g. 9 AM to 11 PM) for better config?
        // For now, let's just pass the full day or slice it.
        // Optimization: Filter to only show hours with activity or current time range.
        const currentHour = new Date().getHours();
        const relevantRevenueData = revenueData.filter(d => d.hour <= currentHour && d.hour >= 9); // Show 9 AM to Now

        // Format Top Items
        const topItemsData = Object.keys(itemCounts)
            .map(key => ({ name: key, value: itemCounts[key] }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5

        return { revenueData: relevantRevenueData, topItemsData };
    };

    const { revenueData, topItemsData } = calculateStats();

    useEffect(() => {
        // Retrieve partner data from local storage
        const storedPartner = localStorage.getItem('partner');
        if (storedPartner) {
            const parsedPartner = JSON.parse(storedPartner);
            setPartner(parsedPartner);
            fetchMyFood(parsedPartner.id || parsedPartner._id);
            fetchOrders(parsedPartner.id || parsedPartner._id);

            // Socket Setup
            const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
            const socket = io(socketUrl);
            socket.emit('join_partner_room', parsedPartner.id || parsedPartner._id); // Assume room logic exists or broadcast globally

            socket.on('new-order', (newOrder) => {
                // Check if this order belongs to us (client side filter for now if broadcast global)
                // For simplicity, just re-fetch or append if we verify ownership
                fetchOrders(parsedPartner.id || parsedPartner._id);
                // Or simplified:
                // setOrders(prev => [newOrder, ...prev]);
                alert("New Order Received! ");
            });

            socket.on('order-updated', (updatedOrder) => {
                setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
            });

            return () => socket.disconnect();
        } else {
            navigate('/food-partner/login');
        }
    }, [navigate]);

    const fetchOrders = async (partnerId) => {
        try {
            const res = await apiClient.get(`/orders/partner/${partnerId}`);
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await apiClient.put(`/orders/${orderId}/status`, { status });
            // Optimistic update
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update status");
        }
    };

    const fetchMyFood = async (partnerId) => {
        try {
            const response = await apiClient.get(`/food/partner/${partnerId}`);
            if (response.data && response.data.fooditems) {
                setMyItems(response.data.fooditems);
            }
        } catch (error) {
            console.error("Error fetching my food:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const response = await apiClient.delete(`/food/${itemId}`);
                if (response.status === 200) {
                    setMyItems(myItems.filter(item => item._id !== itemId));
                }
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item.");
            }
        }
    };


    if (loading) {
        return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-['Plus_Jakarta_Sans'] p-6 md:p-10">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">
                        Restaurant Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Welcome back, <span className="text-[#10B981] font-bold">{partner?.name}</span>
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('partner');
                            localStorage.removeItem('token');
                            localStorage.removeItem('userType');
                            window.location.href = '/food-partner/login';
                        }}
                        className="bg-[#222] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#333] transition shadow-lg border border-white/10"
                    >
                        Logout
                    </button>
                    <Link to="/create-food" className="bg-[#10B981] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#059669] transition shadow-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add New Dish
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Live Orders</div>
                    <div className="text-4xl font-black text-white">{orders.filter(o => o.status !== 'Delivered').length}</div>
                    <div className="text-xs text-[#10B981] mt-1">Needs Attention</div>
                </div>
                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Menu Items</div>
                    <div className="text-4xl font-black text-white">{myItems.length}</div>
                </div>
                <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</div>
                    <div className="text-4xl font-black text-white">₹{orders.reduce((acc, curr) => acc + curr.totalAmount, 0)}</div>
                </div>
            </div>



    // ... (return JSX)

            {/* Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
                <div className="lg:col-span-2">
                    <AnalyticsChart data={revenueData} />
                </div>
                <div className="lg:col-span-1">
                    <TopItemsChart data={topItemsData} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-8 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-4 text-lg font-bold transition-all ${activeTab === 'orders' ? 'text-[#10B981] border-b-2 border-[#10B981]' : 'text-gray-400 hover:text-white'}`}
                >
                    Live Orders
                </button>
                <button
                    onClick={() => setActiveTab('menu')}
                    className={`pb-4 text-lg font-bold transition-all ${activeTab === 'menu' ? 'text-[#10B981] border-b-2 border-[#10B981]' : 'text-gray-400 hover:text-white'}`}
                >
                    Menu Management
                </button>
            </div>

            {/* Live Orders Section */}
            {activeTab === 'orders' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
                    {orders.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-[#1a1a1a] rounded-2xl border border-dashed border-white/10">
                            <div className="text-gray-500 text-lg">No active orders right now.</div>
                            <div className="text-gray-600 text-sm">Time to relax! ☕</div>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order._id} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-[#222] px-3 py-1 rounded-lg text-xs font-bold text-gray-300">#{order._id.slice(-6).toUpperCase()}</span>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${order.status === 'Placed' ? 'bg-blue-500/10 text-blue-500' :
                                                order.status === 'Preparing' ? 'bg-orange-500/10 text-orange-500' :
                                                    order.status === 'Ready' ? 'bg-green-500/10 text-green-500' :
                                                        'bg-gray-500/10 text-gray-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-xs font-bold">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-white">₹{order.totalAmount}</div>
                                        <div className="text-xs text-gray-500">{order.items.length} Items</div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 bg-[#111] p-4 rounded-xl">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#10B981] font-bold">{item.quantity}x</span>
                                                <span className="text-gray-300">{item.name}</span>
                                            </div>
                                            <span className="text-gray-500">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Status Flow Buttons */}
                                    {order.status === 'Placed' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Preparing')}
                                            className="col-span-2 bg-[#FF5E00] hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
                                        >
                                            Accept & Start Cooking 👨‍🍳
                                        </button>
                                    )}

                                    {order.status === 'Preparing' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Ready')}
                                            className="col-span-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
                                        >
                                            Mark Ready for Pickup ✅
                                        </button>
                                    )}

                                    {order.status === 'Ready' && (
                                        <div className="col-span-2 text-center p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 font-bold text-sm animate-pulse">
                                            Waiting for Delivery Partner... 🛵
                                        </div>
                                    )}

                                    {/* Delivery Status Info */}
                                    {order.deliveryStatus !== 'Searching' && (
                                        <div className="col-span-2 mt-2 flex items-center justify-between bg-[#222] p-3 rounded-xl">
                                            <span className="text-xs text-gray-400 font-bold uppercase">Delivery Partner</span>
                                            <span className="text-sm text-white font-bold">{order.deliveryPartner?.fullname || 'Assigned'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* My Menu Section */}
            {activeTab === 'menu' && (
                <>
                    <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">My Active Menu</h2>

                    {myItems.length === 0 ? (
                        <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-dashed border-white/10">
                            <div className="text-gray-500 mb-4">You haven't uploaded any dishes yet.</div>
                            <Link to="/create-food" className="text-[#10B981] font-bold hover:underline">Start Uploading</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {myItems.map((item) => (
                                <div key={item._id} className="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-[#10B981]/50 transition-all">
                                    <div className="aspect-[3/4] relative">
                                        {item.fileType === 'image' ? (
                                            <img src={item.video} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <video src={item.video} className="w-full h-full object-cover" muted />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button className="bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/40 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-white text-lg truncate">{item.name}</h3>
                                        <p className="text-gray-400 text-xs mb-3 line-clamp-1">{item.description}</p>
                                        <div className="flex justify-between items-center text-xs mb-3">
                                            <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded font-bold">Active</span>
                                            <span className="text-gray-500">{(item.price) ? `₹${item.price}` : 'Free'}</span>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Link to={`/edit-food/${item._id}`} className="flex-1 bg-white/10 text-white text-center py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default PartnerDashboard;
