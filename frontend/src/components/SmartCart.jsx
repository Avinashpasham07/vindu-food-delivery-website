import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSquad } from '../context/SquadContext';

const SmartCart = () => {
    const { cartCount, cartTotal } = useCart();
    const { roomId, sharedCart, socket, updateSquadCart } = useSquad();
    const [isVisible, setIsVisible] = React.useState(true);
    const [showOnScroll, setShowOnScroll] = React.useState(false);
    const [isScrolling, setIsScrolling] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const scrollTimeoutRef = React.useRef(null);
    const navigate = useNavigate();
    const { cart, addToCart, decrementItem } = useCart();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    const displayCart = roomId ? sharedCart : cart;

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSquadUpdate = (item, qtyDelta) => {
        if (!roomId) {
            qtyDelta > 0 ? addToCart(item) : decrementItem(item._id);
            return;
        }

        let newCart = [...sharedCart];
        const existing = newCart.find(i => i._id === item._id);
        const userId = socket.id;

        if (existing) {
            if (qtyDelta > 0) {
                existing.quantity += 1;
                existing.split = existing.split || {};
                existing.split[userId] = (existing.split[userId] || 0) + 1;
            } else {
                if (existing.quantity > 1) {
                    existing.quantity -= 1;
                    if (existing.split && existing.split[userId] > 0) {
                        existing.split[userId] -= 1;
                    }
                } else {
                    newCart = newCart.filter(i => i._id !== item._id);
                }
            }
            updateSquadCart(newCart, (qtyDelta > 0 ? 'added ' : 'removed ') + item.name);
        } else if (qtyDelta > 0) {
            newCart.push({ ...item, quantity: 1, split: { [userId]: 1 } });
            updateSquadCart(newCart, 'added ' + item.name);
        }
    };

    const activeCount = roomId ? sharedCart.reduce((acc, item) => acc + item.quantity, 0) : cartCount;
    const activeTotal = roomId ? sharedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : cartTotal;

    // Re-show smart cart when cart updates
    React.useEffect(() => {
        if (activeCount > 0) {
            setIsVisible(true);
        }
    }, [activeCount]);
    // Scroll listener
    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowOnScroll(true);
            } else {
                setShowOnScroll(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Visibility Logic
    // 1. Must have items (activeCount > 0)
    // 2. Must not be manually closed (!isVisible)
    if (activeCount === 0 || !isVisible) return null;

    // Always show on mobile if activeCount > 0.
    // Desktop: Show if scrolled > 100 or Expanded.
    const shouldShow = isMobile ? true : (isExpanded || showOnScroll);

    // CSSTransition classes
    const visibilityClasses = shouldShow
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 translate-y-10 pointer-events-none";

    // Drawer Classes
    const drawerClasses = isExpanded
        ? "translate-y-0 opacity-100 pointer-events-auto"
        : "translate-y-[110%] opacity-0 pointer-events-none";

    // Dynamic Container Classes for Morphing
    // Mobile Collapsed: FAB (Bottom Right)
    // Expanded/Desktop: Wide Bar (Center/Chunky)
    const containerBaseClass = "fixed z-50 transition-all duration-300 ease-out";
    const containerPositionClass = (isMobile && !isExpanded)
        ? "bottom-24 right-4 w-auto" // FAB Position: Elevated (bottom-24 approx 6rem) to sit above BottomNav
        : "bottom-4 left-4 right-4 md:bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-md"; // Bar Position

    return (
        <>
            {/* Backdrop for Expanded State */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsExpanded(false)}
            />

            {/* Main Container (Morphs between FAB and Bar) */}
            <div className={`${containerBaseClass} ${containerPositionClass} ${visibilityClasses}`}>

                {/* Expanded Drawer Content (Absolute to container) */}
                {/* Only render/show if expanded or desktop (logic handled by drawerClasses, but layout depends on container width) */}
                <div className={`absolute bottom-full left-0 right-0 mb-4 bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden transition-transform duration-300 ease-out origin-bottom ${drawerClasses}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-white">Current Order</h3>
                        <button onClick={() => setIsExpanded(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable List */}
                    <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
                        {displayCart.map(item => (
                            <div key={item._id} className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                                    {item.fileType === 'image' ? (
                                        <img src={item.video} className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={item.video} className="w-full h-full object-cover" muted />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold text-sm truncate">{item.name}</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[#FF5E00] font-bold text-xs">₹{item.price * item.quantity}</span>

                                        {/* Mini Quantity Control */}
                                        <div className="flex items-center bg-black/50 border border-white/10 rounded-full h-7 px-1">
                                            <button onClick={() => handleSquadUpdate(item, -1)} className="w-6 h-full text-gray-400 hover:text-white">-</button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => handleSquadUpdate(item, 1)} className="w-6 h-full text-[#FF5E00]">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            const myShare = roomId
                                ? sharedCart.reduce((total, item) => total + (item.price * (item.split?.[socket?.id] || 0)), 0)
                                : 0;
                            navigate('/checkout', { state: { squadAmt: roomId ? myShare : null } });
                            setIsExpanded(false);
                        }}
                        className="w-full py-4 bg-[#FF5E00] hover:bg-[#ff7b29] text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
                    >
                        Checkout {roomId ? 'My Share' : ''} • ₹{roomId ? (activeTotal) : activeTotal}
                    </button>
                </div>

                {/* Minimized Trigger (FAB vs Bar) */}
                <div
                    className={`relative cursor-pointer  active:scale-[0.95] transition-transform shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                        ${isMobile
                            ? (!isExpanded ? "w-16 h-16 rounded-full bg-gradient-to-r from-[#FF5E00] to-[#ff9100] flex items-center justify-center border-4 border-[#0d0d0d]" : "h-0 opacity-0 pointer-events-none") // Mobile: FAB or Hidden (when expanded)
                            : `rounded-2xl p-4 flex items-center justify-between border border-white/10 ${roomId ? 'bg-gradient-to-r from-indigo-900/95 to-purple-900/95' : 'bg-[#1a1a1a]/95'} backdrop-blur-xl` // Desktop: Always Bar
                        }
                    `}
                    onClick={() => { if (!isExpanded) setIsExpanded(true); }} // Only expand if closed. Closing handled by internal buttons.
                >
                    {/* Render Content Based on Mode */}
                    {isMobile ? (
                        !isExpanded ? (
                            // Mobile FAB Content
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-7 h-7 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                {/* Badge */}
                                <div className="absolute top-2 right-2 w-4 h-4 bg-white text-[#FF5E00] text-[10px] font-black rounded-full flex items-center justify-center">
                                    {activeCount}
                                </div>
                            </>
                        ) : null
                    ) : (
                        // Desktop/Expanded Bar Content (Same as before)
                        <>
                            {/* Close Button - Only removes completely (hide) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
                                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 text-gray-400 flex items-center justify-center hover:bg-[#FF5E00] hover:text-white hover:border-[#FF5E00] transition-all shadow-lg z-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                                    {roomId ? 'Squad Cart' : 'Your Cart'} • {activeCount} Items
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>
                                </span>
                                <span className="text-xl font-black text-white">₹{activeTotal} <span className="text-sm font-medium text-gray-500">plus taxes</span></span>
                            </div>

                            <div className="bg-[#FF5E00] hover:bg-[#ff7b29] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2">
                                {isExpanded ? 'Add More' : 'View List'}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
export default SmartCart;
