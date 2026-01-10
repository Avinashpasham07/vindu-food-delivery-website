import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSquad } from '../context/SquadContext';

const FoodCard = ({ item }) => {
    const { addToCart, decrementItem, getItemQuantity } = useCart();
    const { roomId, sharedCart, updateSquadCart, socket } = useSquad();

    // Logic extracted to top level
    const quantity = roomId
        ? (sharedCart.find(i => i._id === item._id)?.quantity || 0)
        : getItemQuantity(item._id);

    const myQty = roomId && socket
        ? (sharedCart.find(i => i._id === item._id)?.split?.[socket.id] || 0)
        : 0;

    const handleAdd = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (roomId && socket) {
            const newCart = [...sharedCart];
            const existing = newCart.find(i => i._id === item._id);
            const userId = socket.id;

            if (existing) {
                existing.quantity += 1;
                existing.split = existing.split || {};
                existing.split[userId] = (existing.split[userId] || 0) + 1;
            } else {
                newCart.push({
                    ...item,
                    quantity: 1,
                    split: { [userId]: 1 }
                });
            }
            updateSquadCart(newCart, 'added ' + item.name);
        } else {
            addToCart(item);
        }
    };

    const handleDecrement = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (roomId && socket) {
            let newCart = [...sharedCart];
            const existing = newCart.find(i => i._id === item._id);
            const userId = socket.id;

            if (existing) {
                if (existing.quantity > 1) {
                    existing.quantity -= 1;
                    // Reduce from current user if they have shares
                    if (existing.split && existing.split[userId] > 0) {
                        existing.split[userId] -= 1;
                    }
                } else {
                    newCart = newCart.filter(i => i._id !== item._id);
                }
                updateSquadCart(newCart, 'removed ' + item.name);
            }
        } else {
            decrementItem(item._id);
        }
    };

    // Reusable Button Component
    const RenderButton = () => (
        quantity === 0 ? (
            <button
                onClick={handleAdd}
                className="w-24 md:w-auto bg-[#FF5E00] text-white font-bold text-xs uppercase tracking-wider px-6 py-2 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 active:scale-95 border border-transparent"
            >
                Add
            </button>
        ) : (
            <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl border border-[#FF5E00] h-9 md:h-10 overflow-hidden relative shadow-lg min-w-[90px]">
                <button
                    onClick={handleDecrement}
                    className="px-3 h-full flex items-center justify-center text-[#FF5E00] hover:bg-[#FF5E00]/10 font-bold text-lg active:scale-90 transition-transform"
                >
                    -
                </button>
                <span className="text-white text-[12px] font-black px-1">
                    {quantity}
                    {roomId && (
                        <div className="text-[7px] text-gray-400 font-normal leading-none -mt-0.5 text-center">You:{myQty}</div>
                    )}
                </span>
                <button
                    onClick={handleAdd}
                    className="px-3 h-full flex items-center justify-center text-[#FF5E00] hover:bg-[#FF5E00]/10 font-bold text-lg active:scale-90 transition-transform"
                >
                    +
                </button>
            </div>
        )
    );

    return (
        <Link
            to={`/food/${item._id}`}
            className="block w-full cursor-pointer group"
        >
            <div className="flex flex-row gap-3 p-3 bg-[#1e1e1e] rounded-2xl md:bg-[#1a1a1a] md:p-0 md:gap-0 md:rounded-[2rem] md:block md:w-full overflow-hidden border border-white/5 hover:border-[#FF5E00]/30 transition-all duration-300 shadow-sm md:shadow-none hover:shadow-lg">

                {/* MEDIA SECTION (Left on Mobile, Top on Desktop) */}
                <div className="relative w-32 h-32 md:w-full md:h-64 flex-shrink-0">
                    <div className="w-full h-full rounded-xl md:rounded-none overflow-hidden relative shadow-md bg-[#222]">
                        {item.fileType === 'image' ? (
                            <img
                                src={item.video}
                                alt={item.name}
                                className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <video
                                src={item.video}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                            />
                        )}

                        {/* Discount Tag (Top Left Mobile) */}
                        {item.discount && (
                            <div className="absolute top-0 left-0 bg-[#2563EB] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm tracking-wide uppercase md:hidden z-10">
                                {item.discount}
                            </div>
                        )}

                        {/* Desktop Overlay Badges */}
                        <div className="absolute inset-x-0 bottom-0 p-3 hidden md:flex justify-between items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                            {item.discount && (
                                <div className="bg-[#2563EB] text-white text-[10px] font-bold px-2 py-1 rounded-[4px] shadow-sm tracking-wide uppercase">
                                    {item.discount}
                                </div>
                            )}
                            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-[6px] text-[10px] font-bold text-black shadow-sm">
                                {item.prepTime || '30m'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFO SECTION (Right on Mobile, Bottom on Desktop) */}
                <div className="flex-1 flex flex-col justify-between md:p-4">
                    <div>
                        {/* Name & Veg Icon */}
                        <div className="flex justify-between items-start">
                            <h4 className="text-[16px] md:text-lg font-bold text-white leading-5 line-clamp-2 flex-1">
                                {item.name}
                            </h4>
                            <div className={`mt-1 ml-2 w-3.5 h-3.5 border ${item.foodType === 'Veg' ? 'border-green-600' : 'border-red-600'} flex-shrink-0 flex items-center justify-center p-[2px] rounded-[3px]`}>
                                <div className={`w-full h-full rounded-full ${item.foodType === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                            </div>
                        </div>

                        {/* Rating & Location/Desc */}
                        <div className="flex items-center gap-1.5 mt-1">
                            {item.averageRating > 0 && (
                                <div className="flex items-center gap-1 bg-green-700/20 border border-green-600/30 px-1.5 py-0.5 rounded-[4px]">
                                    <div className="bg-green-600 rounded-full p-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2 text-white">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[11px] font-bold">{item.averageRating}</span>
                                </div>
                            )}
                            <span className="text-gray-500 text-[10px] font-medium">•</span>
                            <span className="text-gray-400 text-[10px] font-medium">{item.prepTime || '30-35 mins'}</span>
                        </div>

                        <p className="text-gray-500 text-[11px] line-clamp-1 mt-1.5 md:hidden">
                            {item.description || `${item.category}, Fast Food`}
                        </p>

                        {/* Desktop Description & Price & ADD */}
                        <div className="hidden md:flex items-center justify-between mt-2">
                            <div>
                                <div className="text-white font-bold text-lg mb-1">₹{item.price}</div>
                                <p className="text-gray-400 text-xs line-clamp-2 w-[90%]">
                                    {item.description || `${item.category}, Fast Food, Beverages`}
                                </p>
                            </div>
                            <div className="shrink-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                <RenderButton />
                            </div>
                        </div>
                    </div>

                    {/* Price & Add Button (Mobile Only) */}
                    <div className="flex items-end justify-between mt-2 md:hidden">
                        <div className="text-white font-bold text-base">₹{item.price}</div>
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <RenderButton />
                        </div>
                    </div>

                    {/* Desktop Footer Attraction */}
                    <div className="hidden md:flex items-center justify-between mt-3 pt-3 border-t border-white/5" onClick={(e) => e.preventDefault()}>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <img src="https://b.zmtcdn.com/data/o2_assets/4bf016f32f05d26242cea342f30d47a31595763089.png" alt="safety" className="w-3 h-3 grayscale" />
                            <span className="text-[10px] text-gray-400 font-medium">Safe</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#FF5E00] opacity-80 group-hover:opacity-100 transition-opacity">
                            <span className="text-[11px] font-bold tracking-wide uppercase">View Details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link >
    );
};

export default FoodCard;
