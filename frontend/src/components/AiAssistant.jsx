import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

const AiAssistant = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am Vindu AI. Hungry? Tell me your mood! 🍕' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await apiClient.post('/ai/chat', { message: userMsg });

            // Expected JSON: { reply: "string", suggestions: ["Name1", "Name2"] }
            if (res.data) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: res.data.reply,
                    suggestions: res.data.suggestions
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: "my brain froze 🥶. Try again?" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] bg-[#1a1a1a] rounded-[32px] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-[#FF5E00] p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-[#FF5E00]">AI</div>
                        <h3 className="font-bold text-white">Vindu Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="ml-auto text-white/80 hover:text-white">✕</button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.type === 'user'
                                    ? 'bg-[#FF5E00] text-white rounded-tr-none'
                                    : 'bg-[#333] text-gray-200 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>

                                {/* Render Suggestions if any */}
                                {msg.suggestions && msg.suggestions.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {msg.suggestions.map((item, idx) => (
                                            <button
                                                key={idx}
                                                className="px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold rounded-full hover:bg-[#10B981]/20 transition"
                                                onClick={() => {
                                                    // Navigate to food detail page
                                                    navigate(`/food/${item.id}`);
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {item.name} →
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start">
                                <div className="bg-[#333] px-4 py-2 rounded-2xl rounded-tl-none text-sm text-gray-400">Thinking... 🤔</div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-[#111] border-t border-white/5 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-[#222] rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF5E00]"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-[#FF5E00] w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button Container with Tooltip */}
            <div className="relative group">
                {/* Tooltip - "May I help you?" */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        May I help you? 👋
                        {/* Arrow */}
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-white transform rotate-45"></div>
                    </div>
                )}

                {/* Main FAB */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-gradient-to-br from-[#FF5E00] to-orange-600 rounded-full shadow-[0_10px_40px_-10px_rgba(255,94,0,0.5)] flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 animate-bounce-slow relative z-10"
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        // Custom "Magic/Sparkles" Icon
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AiAssistant;
