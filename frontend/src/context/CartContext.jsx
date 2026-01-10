import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

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
