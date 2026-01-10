import React from 'react';
import { useCart } from '../../context/CartContext';
import { useSquad } from '../../context/SquadContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, addToCart, decrementItem, removeFromCart, cartTotal, cartCount } = useCart();
    const { roomId, sharedCart, updateSquadCart, squadMembers, socket } = useSquad();
    const navigate = useNavigate();

    const activeCart = roomId ? sharedCart : cart;
    const activeTotal = roomId ? activeCart.reduce((total, item) => total + (item.price * item.quantity), 0) : cartTotal;
    const activeCount = roomId ? activeCart.reduce((count, item) => count + item.quantity, 0) : cartCount;

    // Helper for squad updates
    const handleSquadUpdate = (item, qtyDelta) => {
        let newCart = [...activeCart];
        const existingIndex = newCart.findIndex(i => i._id === item._id);
        const myId = socket?.id;

        if (qtyDelta === 0) { // Remove item completely
            newCart = newCart.filter(i => i._id !== item._id);
            updateSquadCart(newCart, 'removed ' + item.name);
            return;
        }

        if (existingIndex > -1) {
            // Update existing item
            const existing = { ...newCart[existingIndex] };

            // Ensure split object exists
            if (!existing.split) existing.split = {};
            if (!existing.split[myId]) existing.split[myId] = 0;

            // Update my split
            existing.split[myId] += qtyDelta;
            if (existing.split[myId] < 0) existing.split[myId] = 0;

            // Recalculate total quantity from all splits
            const newTotalQty = Object.values(existing.split).reduce((a, b) => a + b, 0);

            if (newTotalQty <= 0) {
                // Remove item if total quantity is 0
                newCart.splice(existingIndex, 1);
                updateSquadCart(newCart, 'removed ' + item.name);
            } else {
                existing.quantity = newTotalQty;
                newCart[existingIndex] = existing;
                updateSquadCart(newCart, qtyDelta > 0 ? 'added ' + item.name : 'removed ' + item.name);
            }
        } else if (qtyDelta > 0) {
            // Add new item with initial split
            newCart.push({
                ...item,
                quantity: 1,
                split: { [myId]: 1 }
            });
            updateSquadCart(newCart, 'added ' + item.name);
        }
    };

    // Calculate taxes and final total
    const itemTotal = activeTotal;
    const taxes = Math.round(itemTotal * 0.05); // 5% tax
    const deliveryFee = itemTotal > 500 ? 0 : 40;
    const grandTotal = itemTotal + taxes + deliveryFee;

    if (activeCart.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6 font-['Plus_Jakarta_Sans'] text-white relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5E00]/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF5E00]/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/5 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-fade-in-up">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-[#FF5E00]/80">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight animate-slide-up">Your cart is empty</h2>
                    <p className="text-gray-400 mb-10 max-w-md text-lg animate-slide-up animation-delay-100">Looks like you haven't added anything to your cart yet. Discover delicious meals near you.</p>
                    <Link to="/" className="animate-slide-up animation-delay-200 group bg-white text-black px-10 py-4 rounded-full font-bold text-lg transition-all hover:bg-[#FF5E00] hover:text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-[#FF5E00]/50">
                        Browse Food
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] relative overflow-x-hidden pb-32">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#FF5E00]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#FF5E00]/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-8 pb-32 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-12 animate-fade-in">
                    <button onClick={() => navigate(-1)} className="group p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">{roomId ? 'Squad Cart' : 'Your Cart'}</h1>
                        <p className="text-gray-400 text-sm md:text-base font-medium">You have <span className="text-[#FF5E00] font-bold">{activeCount} items</span> in your cart</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 md:gap-10">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-6 animate-slide-up">
                        {activeCart.map((item, index) => (
                            <div key={item._id}
                                className="group bg-[#111]/80 backdrop-blur-md border border-white/5 hover:border-[#FF5E00]/30 rounded-3xl p-3 md:p-5 flex gap-3 md:gap-6 items-center transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:shadow-[#FF5E00]/5"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Item Image */}
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-[#0d0d0d] flex-shrink-0 relative shadow-lg group-hover:scale-105 transition-transform duration-500">
                                    {item.fileType === 'image' ? (
                                        <img src={item.video} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={item.video} className="w-full h-full object-cover" muted autoPlay loop />
                                    )}
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between h-24 py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-white text-lg md:text-xl truncate pr-2 md:pr-4 group-hover:text-[#FF5E00] transition-colors">{item.name}</h3>
                                            <button onClick={() => roomId ? handleSquadUpdate(item, 0) : removeFromCart(item._id)} className="text-gray-600 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-red-500/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="text-[#FF5E00] font-bold text-base md:text-lg">₹{item.price}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-black border border-white/10 rounded-full h-10 px-1 shadow-inner">
                                            <button
                                                onClick={() => roomId ? handleSquadUpdate(item, -1) : decrementItem(item._id)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-90"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
                                            </button>
                                            <span className="w-8 text-center font-bold text-white text-sm">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => roomId ? handleSquadUpdate(item, 1) : addToCart(item)}
                                                className="w-8 h-8 flex items-center justify-center text-white bg-[#FF5E00] hover:bg-[#ff7b29] rounded-full transition-all shadow-lg hover:shadow-[#FF5E00]/40 active:scale-90"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                            </button>
                                        </div>
                                        <div className="text-right flex-1">
                                            <span className="text-sm text-gray-500 font-medium">Total:</span>
                                            <span className="text-white font-bold ml-2">₹{item.price * item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add More Items Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-4 rounded-3xl border-2 border-dashed border-white/10 text-gray-400 hover:text-white hover:border-[#FF5E00]/50 hover:bg-[#FF5E00]/5 transition-all flex items-center justify-center gap-2 group font-bold"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add More Items
                        </button>
                    </div>

                    {/* Bill Details */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 animate-fade-in-up animation-delay-100">
                            <div className="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-5 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">

                                {/* Top Gradient Border */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5E00] via-[#ff9e66] to-[#FF5E00]"></div>

                                <h3 className="font-extrabold text-2xl mb-8 flex items-center gap-3">
                                    Summary
                                </h3>

                                <div className="space-y-5 text-sm font-medium text-gray-400">
                                    <div className="flex justify-between items-center">
                                        <span>Item Total</span>
                                        <span className="text-white text-base">₹{itemTotal}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-2">
                                            Taxes & Charges
                                            <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-gray-300">5%</span>
                                        </span>
                                        <span className="text-white text-base">₹{taxes}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Delivery Fee</span>
                                        <span className={deliveryFee === 0 ? "text-[#10B981] font-bold" : "text-white text-base"}>
                                            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                                        </span>
                                    </div>

                                    <div className="my-6 border-t border-dashed border-white/10"></div>

                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold text-white mb-1">Grand Total</span>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 mb-1">Incl. all taxes</div>
                                            <span className="text-4xl font-black text-[#FF5E00] tracking-tight">₹{grandTotal}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const myShare = roomId
                                            ? activeCart.reduce((total, item) => total + (item.price * (item.split?.[socket?.id] || 0)), 0)
                                            : 0;

                                        navigate('/checkout', {
                                            state: {
                                                squadAmt: roomId ? myShare : null
                                            }
                                        });
                                    }}
                                    className="w-full mt-8 bg-white text-black hover:bg-[#FF5E00] hover:text-white py-5 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                                >
                                    {roomId ? 'Pay My Share' : 'Proceed to Checkout'}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>

                                <div className="mt-6 flex justify-center items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-5 bg-gray-600 rounded"></div>
                                        <div className="w-8 h-5 bg-gray-500 rounded"></div>
                                        <div className="w-8 h-5 bg-gray-400 rounded"></div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2">Secure Payment</span>
                                </div>
                            </div>

                            {/* Squad Bill Split Section */}
                            {roomId && (
                                <div className="mt-6 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-5 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden animate-fade-in-up animation-delay-200">
                                    <h3 className="font-extrabold text-xl mb-6 flex items-center gap-3 text-white">
                                        <span className="text-2xl">🧾</span> Itemized Bill Split
                                    </h3>

                                    <div className="flex items-center justify-between mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <span className="text-gray-400 font-medium">Your Personal Share</span>
                                        <span className="text-2xl font-bold text-[#FF5E00]">
                                            ₹{activeCart.reduce((total, item) => total + (item.price * (item.split?.[socket?.id] || 0)), 0)}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Squad Members</p>
                                        {squadMembers.map((member, idx) => {
                                            const memberItems = activeCart.filter(item => (item.split?.[member.id] || 0) > 0);
                                            const memberTotal = memberItems.reduce((total, item) => total + (item.price * item.split[member.id]), 0);

                                            return (
                                                <div key={idx} className="flex items-center justify-between group py-1">
                                                    <div className="flex items-center gap-3 max-w-[70%]">
                                                        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                            {member.avatar ? <img src={member.avatar} className="w-full h-full rounded-full" /> : member.name[0]}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className={`${member.id === socket?.id ? "text-[#FF5E00] font-bold" : "text-gray-300"} text-sm truncate`}>
                                                                {member.name} {member.isHost && '👑'}
                                                            </span>
                                                            {memberItems.length > 0 && (
                                                                <span className="text-[11px] text-gray-500 truncate block">
                                                                    {memberItems.map(i => `${i.name} x${i.split[member.id]}`).join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 mx-2 mb-1 border-b border-white/20 border-dotted shrink-0 min-w-[20px]"></div>
                                                    <span className="text-sm font-bold text-white whitespace-nowrap">₹{memberTotal}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
