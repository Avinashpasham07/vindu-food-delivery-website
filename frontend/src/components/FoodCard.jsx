import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useSquad } from '../context/SquadContext';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, ShoppingBag, Clock } from 'lucide-react';

const isImageUrl = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url.toLowerCase()) || url.includes('images.unsplash.com');
};

const FoodCard = ({ item }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
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
            updateSquadCart(newCart, 'added ' + item.name);
        } else {
            const user = localStorage.getItem('user');
            if (!user) {
                toast.error("Please login to order", {
                    icon: <ShoppingBag className="w-5 h-5 text-[#FF5E00]" />,
                    style: {
                        borderRadius: '16px',
                        background: '#1a1a1a',
                        color: '#fff',
                        border: '1px solid rgba(255,94,0,0.5)'
                    }
                });
                navigate('/user/login');
                return;
            }
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
                className="w-24 md:w-auto bg-[var(--accent)] text-white font-bold text-xs uppercase tracking-wider px-6 py-2 rounded-xl transition-all shadow-lg shadow-[var(--accent-glow)] active:scale-95 border border-transparent"
            >
                {t('add')}
            </button>
        ) : (
            <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl border border-[var(--accent)] h-9 md:h-10 overflow-hidden relative shadow-lg min-w-[90px]">
                <button
                    onClick={handleDecrement}
                    className="px-3 h-full flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)]/10 font-bold active:scale-90 transition-transform"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="text-white text-[12px] font-black px-1">
                    {quantity}
                    {roomId && (
                        <div className="text-[7px] text-gray-400 font-normal leading-none -mt-0.5 text-center">You:{myQty}</div>
                    )}
                </span>
                <button
                    onClick={handleAdd}
                    className="px-3 h-full flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)]/10 font-bold active:scale-90 transition-transform"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        )
    );

    // Get gold status
    const isGold = JSON.parse(localStorage.getItem('user') || '{}').isGoldMember;

    return (
        <Link
            to={`/food/${item._id}`}
            className="block w-full cursor-pointer group"
        >
            {/* Main Container: Mobile = Vertical Card, Desktop = Vertical Card (Consistent Feed Style) */}
            <div className={`flex flex-col gap-0 bg-[var(--card-bg)] rounded-xl md:bg-[var(--card-bg)] md:rounded-2xl w-full overflow-hidden border ${isGold ? 'border-[#D4AF37]/30 shadow-[0_5px_15px_rgba(212,175,55,0.1)]' : 'border-white/5'} hover:border-[var(--accent)] transition-all duration-300 shadow-sm hover:shadow-lg relative`}>
                
                {/* Gold Shimmer Overlay */}
                {isGold && <div className="absolute inset-0 animate-shimmer pointer-events-none z-10 opacity-30"></div>}

                {/* MEDIA SECTION */}
                <div className="relative w-full aspect-video overflow-hidden">
                    <div className="w-full h-40 sm:h-56 md:h-64 bg-[#222] relative group-hover:scale-105 transition-transform duration-700">
                        {item.images && item.images.length > 0 ? (
                            <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : item.fileType === 'image' || isImageUrl(item.video) ? (
                            <img
                                src={item.video}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                src={item.video}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                            />
                        )}

                        {/* Badges Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-2 flex justify-between items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                            {item.discount && (
                                <div className="bg-[#2563EB] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] shadow-sm tracking-wide uppercase">
                                    {item.discount}
                                </div>
                            )}
                            <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-[6px] text-[9px] font-bold text-black shadow-sm flex items-center gap-1">
                                <Clock className="w-2 h-2" />
                                {item.prepTime || '30m'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="flex flex-col justify-between p-3 gap-2">
                    <div>
                        {/* Name & Veg Icon */}
                        <div className="flex justify-between items-start">
                            <h4 className="text-[13px] md:text-base font-bold text-white leading-tight line-clamp-1 flex-1">
                                {item.name}
                            </h4>
                            <div className={`mt-0.5 ml-1.5 w-2 h-2 border ${item.foodType === 'Veg' ? 'border-green-600' : 'border-red-600'} flex-shrink-0 flex items-center justify-center p-[1px] rounded-[2px]`}>
                                <div className={`w-full h-full rounded-full ${item.foodType === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                            </div>
                        </div>

                        {/* Rating & Desc */}
                        <div className="flex items-center gap-1 mt-1">
                            {item.averageRating > 0 && (
                                <div className="flex items-center gap-0.5 bg-green-700/20 border border-green-600/30 px-1 py-0.5 rounded-[3px]">
                                    <span className="text-white text-[9px] font-bold">{item.averageRating}</span>
                                </div>
                            )}
                            <p className="text-gray-400 text-[9px] md:text-xs line-clamp-1 flex-1">
                                {item.description || item.category}
                            </p>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                        <div className="text-white font-black text-xs md:text-base">₹{item.price}</div>
                        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                            <RenderButton />
                        </div>
                    </div>
                </div>
            </div>
        </Link >
    );
};

export default FoodCard;
