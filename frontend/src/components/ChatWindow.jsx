import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const socket = io(socketUrl);

const ChatWindow = ({ orderId, currentUser, senderModel }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Join Chat Room
        socket.emit('join_order_room', orderId);

        // Fetch History
        fetchHistory();

        // Listen for new messages
        socket.on('new_message', (message) => {
            setMessages(prev => [...prev, message]);
            if (!isOpen) setUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.off('new_message');
        };
    }, [orderId, isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const fetchHistory = async () => {
        try {
            const res = await apiClient.get(`/orders/${orderId}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error("Chat History Error:", err);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messageData = {
            orderId,
            senderId: currentUser.id || currentUser._id,
            senderModel: senderModel, // 'User' | 'DeliveryPartner' | 'FoodPartner'
            senderName: currentUser.fullname || currentUser.businessName || 'User',
            text: inputText
        };

        socket.emit('send_message', messageData);
        setInputText('');
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setUnreadCount(0);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[2000] font-['Plus_Jakarta_Sans']">
            {/* Chat Bubble */}
            <button 
                onClick={toggleChat}
                className="w-16 h-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all relative group"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5E00] to-orange-400 opacity-0 group-hover:opacity-20 rounded-full transition-opacity"></div>
                💬
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#050505] animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[90vw] max-w-[400px] h-[500px] bg-[#111] border border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div>
                            <p className="text-[#FF5E00] text-[10px] font-black uppercase tracking-widest leading-none mb-1">Live Chat</p>
                            <h3 className="text-white font-bold">Mission Comms</h3>
                        </div>
                        <button onClick={toggleChat} className="text-gray-500 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
                    >
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale scale-90">
                                <span className="text-4xl mb-2">💬</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">No signals received yet...</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isMe = msg.senderId === (currentUser.id || currentUser._id);
                                return (
                                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                                            isMe 
                                            ? 'bg-[#FF5E00] text-white rounded-br-none shadow-lg shadow-orange-500/10' 
                                            : 'bg-white/5 text-gray-300 border border-white/5 rounded-bl-none'
                                        }`}>
                                            {!isMe && (
                                                <p className="text-[9px] font-black uppercase tracking-tighter opacity-50 mb-1">{msg.senderName}</p>
                                            )}
                                            <p className="leading-relaxed">{msg.text}</p>
                                        </div>
                                        <p className="text-[8px] font-bold text-gray-600 uppercase mt-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-6 bg-white/[0.02] border-t border-white/5">
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-2 pl-4 focus-within:border-[#FF5E00]/50 transition-all">
                            <input 
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Send signal..."
                                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-700"
                            />
                            <button 
                                type="submit"
                                className="w-10 h-10 bg-[#FF5E00] text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
