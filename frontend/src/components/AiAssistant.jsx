import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import { 
    Sparkles, 
    Send, 
    X, 
    MessageCircle, 
    Bot,
    ChevronRight,
    CircleEllipsis,
    Frown
} from 'lucide-react';

const AiAssistant = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am Vindu AI. Hungry? Tell me your mood!' }
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

            if (res.data) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: res.data.reply,
                    suggestions: res.data.suggestions
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: "My brain froze. Try again?", error: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[90vw] max-w-[350px] h-[500px] max-h-[70vh] bg-[#1a1a1a] rounded-[24px] md:rounded-[32px] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-[#FF5E00] p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF5E00]">
                            <Bot className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-white">Vindu Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="ml-auto p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <React.Fragment key={idx}>
                                <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-4 group`}>
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.type === 'user'
                                        ? 'bg-[#FF5E00] text-white rounded-tr-none'
                                        : 'bg-[#333] text-gray-200 rounded-tl-none'
                                        } ${msg.error ? 'border border-red-500/30' : ''}`}>
                                        <div className="flex items-start gap-2">
                                            {msg.type === 'bot' && <Bot className="w-4 h-4 mt-0.5 text-[#FF5E00]" />}
                                            {msg.error && <Frown className="w-4 h-4 mt-0.5 text-red-400" />}
                                            <p className="flex-1">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>

                                {msg.suggestions && msg.suggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 mb-6">
                                        {msg.suggestions.map((item, id) => (
                                            <button
                                                key={id}
                                                className="px-3 py-1 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold rounded-full hover:bg-[#10B981]/20 transition-all flex items-center gap-1.5"
                                                onClick={() => {
                                                    navigate(`/food/${item.id}`);
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {item.label} <ArrowRight className="w-3 h-3" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        {loading && (
                            <div className="flex items-start">
                                <div className="bg-[#333] px-4 py-2 rounded-2xl rounded-tl-none text-sm text-gray-400 flex items-center gap-2">
                                    <CircleEllipsis className="w-4 h-4 animate-pulse" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-[#111] border-t border-white/5 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-[#222] rounded-full px-4 py-2 text-sm text-white border border-white/5 focus:outline-none focus:border-[#FF5E00] transition-colors"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-[#FF5E00] w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-all active:scale-90"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button Container with Tooltip */}
            <div className="relative group">
                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black text-xs font-extrabold px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0">
                        May I help you?
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-white transform rotate-45"></div>
                    </div>
                )}

                {/* Main FAB */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FF5E00] to-orange-600 rounded-full shadow-[0_10px_40px_-10px_rgba(255,94,0,0.5)] flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 animate-bounce-slow relative z-10 hover:shadow-orange-500/40"
                >
                    {isOpen ? (
                        <X className="w-7 h-7 md:w-8 md:h-8" />
                    ) : (
                        <Sparkles className="w-7 h-7 md:w-8 md:h-8" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default AiAssistant;
