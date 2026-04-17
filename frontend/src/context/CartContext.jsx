import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { 
    MapPin, 
    Truck, 
    Star 
} from 'lucide-react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const calculateHaversine = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Failed to load cart", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, qty = 1) => {
        setCart(prevCart => {
            const existing = prevCart.find(i => i._id === item._id);
            if (existing) {
                return prevCart.map(i =>
                    i._id === item._id ? { ...i, quantity: i.quantity + qty } : i
                );
            }

            // --- Multi-Restaurant Proximity Check ---
            if (prevCart.length > 0) {
                const newPartner = item.foodpartner;
                if (newPartner && newPartner.location) {
                    // Check distance against all existing partners in cart
                    const existingPartners = Array.from(new Set(prevCart.map(i => i.foodpartner?._id))).map(id => {
                        return prevCart.find(i => i.foodpartner?._id === id).foodpartner;
                    });

                    const isWithinRange = existingPartners.some(partner => {
                        if (!partner?.location) return true; // Skip if no location (defensive)
                        const distance = calculateHaversine(
                            newPartner.location.lat, newPartner.location.lng,
                            partner.location.lat, partner.location.lng
                        );
                        return distance <= 3;
                    });

                    if (!isWithinRange) {
                        toast.error(`${item.name} is too far! Items must be within 3km of each other for grouped delivery.`, {
                            duration: 4000,
                            position: 'bottom-center',
                            icon: <MapPin className="w-5 h-5 text-red-500" />
                        });
                        return prevCart; // Block adding
                    }

                    // Success Feedback for cluster addition
                    const firstPartner = existingPartners[0];
                    if (newPartner._id !== firstPartner._id) {
                         toast.success(`Cluster expanded! ${newPartner.name} added to your route.`, {
                            icon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />,
                            position: 'bottom-center'
                         });
                    }
                }
            }

            return [...prevCart, { ...item, quantity: qty }];
        });
    };

    const decrementItem = (itemId) => {
        setCart(prevCart => {
            const existing = prevCart.find(i => i._id === itemId);
            if (existing && existing.quantity > 1) {
                return prevCart.map(i =>
                    i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                );
            }
            return prevCart.filter(i => i._id !== itemId);
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    };

    const getItemQuantity = (itemId) => {
        const item = cart.find(i => i._id === itemId);
        return item ? item.quantity : 0;
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            decrementItem,
            removeFromCart,
            getItemQuantity,
            cartTotal,
            cartCount,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
