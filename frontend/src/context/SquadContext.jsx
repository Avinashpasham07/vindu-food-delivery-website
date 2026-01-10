import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SquadContext = createContext();

const socket = io('http://localhost:3000', {
    autoConnect: false,
    withCredentials: true
});

export const SquadProvider = ({ children }) => {
    const [roomId, setRoomId] = useState(null);
    const [squadMembers, setSquadMembers] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [sharedCart, setSharedCart] = useState([]);

    useEffect(() => {
        // Listen for squad updates
        socket.on('squad_created', ({ roomId, members }) => {
            setRoomId(roomId);
            setSquadMembers(members);
            setIsHost(true);
        });

        socket.on('squad_updated', ({ members, cart }) => {
            setSquadMembers(members);
            if (cart) setSharedCart(cart);
        });

        socket.on('cart_synced', ({ cart, action, user }) => {
            setSharedCart(cart);
            // Optional: Show toast "User added Burger"
            console.log(`${user} ${action}`);
        });

        return () => {
            socket.off('squad_created');
            socket.off('squad_updated');
            socket.off('cart_synced');
        };
    }, []);

    const startSquad = (userName, userAvatar) => {
        socket.connect();
        socket.emit('create_squad', { hostName: userName, hostAvatar: userAvatar });
    };

    const joinSquad = (code, userName, userAvatar) => {
        socket.connect();
        socket.emit('join_squad', { roomId: code, userName, userAvatar });
        setRoomId(code);
    };

    const updateSquadCart = (cartItems, action) => {
        if (!roomId) return;
        socket.emit('update_cart', {
            roomId,
            cartItems,
            action,
            user: 'Me' // Replace with actual user name if available
        });
    };

    const leaveSquad = () => {
        socket.disconnect();
        setRoomId(null);
        setSquadMembers([]);
        setSharedCart([]);
    };

    return (
        <SquadContext.Provider value={{
            socket,
            roomId,
            squadMembers,
            isHost,
            startSquad,
            joinSquad,
            leaveSquad,
            sharedCart,
            updateSquadCart
        }}>
            {children}
        </SquadContext.Provider>
    );
};

export const useSquad = () => useContext(SquadContext);
