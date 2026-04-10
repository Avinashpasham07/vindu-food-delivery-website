import React, { useState } from 'react';

const MOODS = [
    { label: 'Happy', image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=600&auto=format&fit=crop', color: 'from-orange-400 to-yellow-500', tags: ['Comfort Food', 'Desserts', 'Burger'], icon: '✨' },
    { label: 'Relaxed', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop', color: 'from-indigo-400 to-blue-500', tags: ['Soup', 'Tea', 'Snacks'], icon: '🍵' },
    { label: 'Party', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600&auto=format&fit=crop', color: 'from-purple-500 to-pink-600', tags: ['Non-Veg', 'Biryani', 'Starters'], icon: '🎉' },
    { label: 'Energetic', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop', color: 'from-red-500 to-orange-600', tags: ['Protein', 'Healthy', 'Coffee'], icon: '⚡' },
    { label: 'Romantic', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600&auto=format&fit=crop', color: 'from-rose-500 to-pink-600', tags: ['Pizza', 'Desserts', 'Beverages'], icon: '🌹' },
    { label: 'Lazy', image: 'https://images.unsplash.com/photo-1517093602195-b40af9688b46?q=80&w=600&auto=format&fit=crop', color: 'from-gray-500 to-slate-600', tags: ['Snacks', 'Burger', 'Fast Food'], icon: '🍕' },
];

const MoodSelector = ({ onMoodSelect }) => {
    const [selectedMood, setSelectedMood] = useState(null);

    const handleSelect = (mood) => {
        const newMood = selectedMood === mood.label ? null : mood.label;
        setSelectedMood(newMood);
        onMoodSelect(newMood ? mood.tags : []);
    };

    return (
        <div className="w-full py-12 relative overflow-hidden group/selector">
            {/* Liquid Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 group-hover/selector:bg-orange-500/10 transition-colors duration-700"></div>
            
            <div className="flex items-center justify-between px-6 mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">How's the mood today?</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Pick a vibe, we'll find the bite</p>
                </div>
                {selectedMood && (
                    <button 
                        onClick={() => handleSelect({ label: selectedMood, tags: [] })} 
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                    >
                        <span>RESET VIBE</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex gap-6 overflow-x-auto pb-12 px-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] snap-x">
                {MOODS.map((mood) => (
                    <button
                        key={mood.label}
                        onClick={() => handleSelect(mood)}
                        className={`
                            relative group flex-shrink-0 w-36 h-48 rounded-[32px] overflow-hidden transition-all duration-500 snap-start
                            ${selectedMood === mood.label
                                ? 'scale-105 ring-2 ring-[#FF5E00] shadow-[0_30px_60px_-15px_rgba(255,94,0,0.4)]'
                                : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'}
                        `}
                    >
                        {/* Background Image with Zoom Effect */}
                        <img 
                            src={mood.image} 
                            alt={mood.label} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />

                        {/* Liquid Gradients */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${mood.color} opacity-40 mix-blend-overlay group-hover:opacity-60 transition-opacity`} />
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                            <span className="text-3xl mb-2 transform group-hover:scale-125 transition-transform duration-500 drop-shadow-xl">
                                {mood.icon}
                            </span>
                            <span className="text-white font-black text-lg tracking-tight drop-shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                {mood.label}
                            </span>
                        </div>

                        {/* Selected Liquid Glow */}
                        {selectedMood === mood.label && (
                            <div className="absolute inset-0 border-4 border-white/20 rounded-[32px] animate-pulse pointer-events-none"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;
