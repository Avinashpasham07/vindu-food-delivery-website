import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const VideoContent = ({ data, isActive, isMuted, toggleMute }) => {
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(data.likes ? data.likes.length : 0);
    const [showHeart, setShowHeart] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        setLikeCount(data.likes ? data.likes.length : 0);
    }, [data.likes]);

    useEffect(() => {
        if (isActive) {
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.muted = isMuted;
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Autoplay prevented:", error);
                        setIsPlaying(false);
                    });
                }
                setIsPlaying(true);
            }
        } else {
            if (videoRef.current) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [isActive]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const handleVisitStore = (e) => {
        e.stopPropagation();
        navigate(`/food/${data._id}`);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleLike = async () => {
        // Optimistic UI update
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

        try {
            const response = await axios.put(`http://localhost:3000/api/food/${data._id}/like`, {}, {
                withCredentials: true
            });

            if (response.status === 200) {
                setLiked(response.data.isLiked);
                setLikeCount(response.data.likes.length);
            }
        } catch (error) {
            console.error("Error liking post:", error);
            // Revert on error
            setLiked(!newLikedState);
            setLikeCount(prev => !newLikedState ? prev + 1 : prev - 1);
        }
    };

    const handleDoubleTap = (e) => {
        e.stopPropagation();
        if (!liked) {
            handleLike();
        }
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
    };

    // Handle clicks for play/pause vs double tap
    const lastClickTime = useRef(0);
    const handleVideoClick = (e) => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime.current;

        if (timeDiff < 300) {
            handleDoubleTap(e);
        } else {
            togglePlay();
        }
        lastClickTime.current = currentTime;
    };

    return (
        <div className="relative w-full h-full bg-black cursor-pointer group" onClick={handleVideoClick}>
            {/* Header / Top Shadow for text visibility */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none"></div>

            {/* Video Player */}
            {data.fileType === 'image' ? (
                <img
                    className="w-full h-full object-cover opacity-90"
                    src={data.video}
                    alt={data.name}
                />
            ) : (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={data.video}
                    loop
                    playsInline
                />
            )}

            {/* Like Heart Animation */}
            {showHeart && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-ping duration-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" className="w-32 h-32 drop-shadow-2xl">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.312 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                </div>
            )}

            {/* Play/Pause Indicator */}
            {!isPlaying && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/30 w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm pointer-events-none z-20 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-10 h-10 ml-1">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            )}

            {/* Mute Toggle (Top Right) */}
            <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="absolute top-16 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white transition-all hover:bg-black/40 z-30"
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                )}
            </button>

            {/* Right Side Action Bar */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20" onClick={(e) => e.stopPropagation()}>
                {/* Like Button */}
                <div className="flex flex-col items-center gap-1 group/like">
                    <button
                        onClick={handleLike}
                        className={`p-3 rounded-full bg-black/20 backdrop-blur-md transition-all active:scale-90 hover:bg-black/40 ${liked ? 'text-red-500' : 'text-white'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={liked ? "0" : "2.5"} className="w-7 h-7 filter drop-shadow-md">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.312 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    </button>
                    <span className="text-white text-xs font-bold drop-shadow-md">{likeCount}</span>
                </div>

                {/* Share Button */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Check out this dish!',
                                    text: `${data.name} from ${data.foodpartner}`,
                                    url: window.location.href,
                                }).catch(console.error);
                            } else {
                                alert('Share not supported');
                            }
                        }}
                        className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white transition-all active:scale-90 hover:bg-black/40"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="w-7 h-7 filter drop-shadow-md">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                    </button>
                    <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
                </div>

                {/* More Options */}
                <button className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white transition-all active:scale-90 hover:bg-black/40">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                </button>
            </div>

            {/* Bottom Overlay Info - Premium Glass/Gradient */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-5 pb-32 lg:pb-10 pt-32 z-10 flex flex-col justify-end items-start pointer-events-none">
                <div className="w-[85%] flex flex-col gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>

                    {/* Food Details */}
                    <div>
                        <h3 className="text-white text-xl font-bold leading-tight drop-shadow-lg mb-1 line-clamp-2">
                            {data.name}
                        </h3>
                        <div className="flex items-center gap-3 text-gray-200 text-xs font-medium mb-3">
                            {data.price && (
                                <span className="text-[#FF5E00] font-black text-lg">₹{data.price}</span>
                            )}
                            <span className="text-gray-400">•</span>
                            <span>{data.category}</span>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                                <span>{data.averageRating || '4.5'}</span>
                            </div>
                        </div>
                        <p className="text-gray-300 text-xs line-clamp-2 opacity-90 leading-relaxed max-w-[90%] mb-3">
                            {data.description}
                        </p>
                    </div>

                    {/* User / Partner Badge */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-[#FF5E00] p-[1.5px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <span className="text-white font-bold text-[10px]">
                                    {data.foodpartner?.name?.charAt(0).toUpperCase() || data.name.charAt(0)}
                                </span>
                            </div>
                        </div>
                        <span className="text-white font-medium text-xs tracking-wide shadow-black drop-shadow-md opacity-90">
                            {data.foodpartner?.name || 'Partner'}
                        </span>
                    </div>

                    {/* CTA Button */}
                    <button
                        className="mt-2 w-full max-w-[280px] bg-[#FF5E00] text-white py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-orange-900/40 active:scale-95 transition-all flex items-center justify-between group/btn"
                        onClick={handleVisitStore}
                    >
                        <span>View Details</span>
                        <div className="bg-white/20 p-1 rounded-full group-hover/btn:translate-x-1 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const VideoReel = ({ data, isActive, isMuted, toggleMute }) => {
    return (
        <div className="video-reel h-screen min-h-screen w-full relative snap-start bg-black flex justify-center items-center lg:w-[450px] lg:border-x lg:border-[#333] lg:shadow-2xl" data-id={data._id}>
            <VideoContent data={data} isActive={isActive} isMuted={isMuted} toggleMute={toggleMute} />
        </div>
    );
};

const ReelsPage = () => {
    const containerRef = useRef(null);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReelId, setActiveReelId] = useState(null);
    const [isMuted, setIsMuted] = useState(true); // Default muted for autoplay policy

    const toggleMute = () => setIsMuted(!isMuted);

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/food', {
                    withCredentials: true
                });
                if (response.data && response.data.fooditems) {
                    setReels(response.data.fooditems);
                    if (response.data.fooditems.length > 0) {
                        setActiveReelId(response.data.fooditems[0]._id);
                    }
                }
            } catch (error) {
                console.error("Error fetching reels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFood();
    }, []);

    useEffect(() => {
        if (reels.length === 0) return;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const videoId = entry.target.dataset.id;
                    setActiveReelId(videoId);
                }
            });
        }, options);

        setTimeout(() => {
            const videoElements = document.querySelectorAll('.video-reel');
            videoElements.forEach((el) => observer.observe(el));
        }, 100);

        return () => {
            observer.disconnect();
        };
    }, [reels]);

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-[#0d0d0d] text-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#FF5E00] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-gray-400 font-medium">Loading Reels...</div>
            </div>
        </div>;
    }

    return (
        <div className="reels-container h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-[#0d0d0d] [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] flex flex-col items-center lg:bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop')] lg:bg-cover lg:bg-center lg:bg-fixed" ref={containerRef}>
            {reels.map((reel) => (
                <div key={reel._id} className="video-reel-wrapper contents">
                    <VideoReel
                        data={reel}
                        isActive={activeReelId === reel._id}
                        isMuted={isMuted}
                        toggleMute={toggleMute}
                    />
                </div>
            ))}
            {reels.length === 0 && (
                <div className="text-white text-center mt-20">No reels found. Be the first to create one!</div>
            )}
        </div>
    );
};

export default ReelsPage;
