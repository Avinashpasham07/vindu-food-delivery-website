import React, { useState } from 'react';

const MOODS = [
    { label: 'Happy', image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=600&auto=format&fit=crop', color: 'from-orange-400/80 to-yellow-500/80', tags: ['Comfort Food', 'Desserts', 'Burger'], icon: '✨' },
    { label: 'Relaxed', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop', color: 'from-indigo-400/80 to-blue-500/80', tags: ['Soup', 'Tea', 'Snacks'], icon: '🍵' },
    { label: 'Energetic', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop', color: 'from-red-500/80 to-orange-600/80', tags: ['Protein', 'Healty', 'Coffee'], icon: '⚡' },
    { label: 'Romantic', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600&auto=format&fit=crop', color: 'from-rose-500/80 to-pink-600/80', tags: ['Italian', 'Desserts', 'Wine'], icon: '🍷' },
    { label: 'Focused', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop', color: 'from-emerald-500/80 to-teal-600/80', tags: ['Salad', 'Nuts', 'Water'], icon: '🥗' },
];

const MoodSelector = ({ onMoodSelect }) => {
    const [selectedMood, setSelectedMood] = useState(null);

    const handleSelect = (mood) => {
        const newMood = selectedMood === mood.label ? null : mood.label;
        setSelectedMood(newMood);
        onMoodSelect(newMood ? mood.tags : []);
    };
    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between px-6 mb-6">
                <h2 className="text-2xl font-black text-white tracking-tight">What's your mood?</h2>
                {selectedMood && (
                    <button onClick={() => handleSelect({ label: selectedMood, tags: [] })} className="text-xs font-bold text-[#FF5E00] uppercase tracking-wider hover:text-white transition-colors">
                        Reset
                    </button>
                )}
            </div>
            <div className="flex gap-4 py-10 -mt-10 overflow-x-auto pb-8 px-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] snap-x">
                {MOODS.map((mood) => (
                    <button
                        key={mood.label}
                        onClick={() => handleSelect(mood)}
                        className={`
                            relative group flex-shrink-0 w-32 h-40 rounded-3xl overflow-hidden transition-all duration-300 snap-start
                            ${selectedMood === mood.label
                                ? 'ring-4 ring-[#FF5E00] ring-offset-4 ring-offset-[#050505] shadow-[0_20px_40px_-10px_rgba(255,94,0,0.3)]'
                                : ' opacity-80 hover:opacity-100'}
                        `}
                    >
                        {/* Background Image */}
                        <img src={mood.image} alt={mood.label} className="absolute inset-0 w-full h-full object-cover" />

                        {/* Gradient Overlay - Lighter and Centered Focus */}
                        <div className={`absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300`} />
                        <div className={`absolute inset-0 bg-gradient-to-t ${mood.color} opacity-40 mix-blend-overlay`} />

                        {/* Content - Centered */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                            <span className="text-white font-black text-lg tracking-wide drop-shadow-lg shadow-black/50">{mood.label}</span>
                        </div>

                        {/* Selected Indicator */}
                        {selectedMood === mood.label && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-[#FF5E00] rounded-full flex items-center justify-center shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default MoodSelector;
