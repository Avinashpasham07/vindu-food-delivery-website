import React, { useState, useEffect } from 'react';

const FoodCursor = () => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            // Using requestAnimationFrame for smoother performance
            requestAnimationFrame(() => {
                setCursorPos({ x: e.clientX, y: e.clientY });
            });
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Hid cursor on touch devices to prevent artifacts
    if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return null;

    return (
        <div
            className={`fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center transition-transform duration-100 ease-out will-change-transform ${isClicking ? 'scale-75' : isHovering ? 'scale-125' : 'scale-100'}`}
            style={{
                transform: `translate3d(${cursorPos.x - 20}px, ${cursorPos.y - 20}px, 0)`
            }}
        >
            <div className={`relative w-10 h-10 flex items-center justify-center transition-all duration-300 ${isHovering ? 'rotate-12' : 'rotate-0'}`}>
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-[#FF5E00]/20 blur-md rounded-full"></div>

                {/* Main Icon (Pizza Slice) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-[#FF5E00] drop-shadow-lg"
                >
                    <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                </svg>
            </div>

            {/* Trailing particles or effects could go here */}
        </div>
    );
};

/* Using a Pizza Slice Icon instead of cube above to match request */
// Replacing SVG with an actual Pizza icon logic for better visuals
const FoodCursorFinal = () => {
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let frameId;
        const updatePos = (e) => {
            // Direct update for responsiveness
            setCursorPos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('a') || target.closest('button') || target.classList.contains('cursor-pointer');
            setIsHovering(!!isClickable);
        };

        window.addEventListener('mousemove', updatePos);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updatePos);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Hide on mobile
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

    return (
        <div
            className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform rounded-full duration-75 ease-out will-change-transform"
            style={{ transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)` }}
        >
            {/* Offset wrapper to center the icon on mouse */}
            <div className={`relative -left-1/2 -top-1/2 transition-all duration-300 ${isHovering ? 'scale-125 rotate-12' : 'scale-100 rotate-0'}`}>
                {/* Vindu Logo Image with Border */}
                <img
                    src="/logo.png"
                    alt="Vindu Cursor"
                    className="w-10 h-10 object-cover rounded-full border-2 border-[#FF5E00] shadow-[0_0_15px_rgba(255,94,0,0.5)] bg-black"
                />
            </div>
        </div>
    );
};

export default FoodCursorFinal;
