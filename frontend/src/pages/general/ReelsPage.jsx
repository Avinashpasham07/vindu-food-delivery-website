import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import '../../App.css';
import { 
    Heart, 
    Play, 
    VolumeX, 
    Volume2, 
    Share2, 
    MoreHorizontal, 
    Star, 
    ChevronRight,
    Loader2
} from 'lucide-react';

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
            const response = await apiClient.put(`/food/${data._id}/like`);

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
                    <Heart className="w-32 h-32 text-red-500 fill-red-500 drop-shadow-2xl" />
                </div>
            )}

            {/* Play/Pause Indicator */}
            {!isPlaying && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/30 w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm pointer-events-none z-20 animate-pulse">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                </div>
            )}

            {/* Mute Toggle (Top Right) */}
            <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="absolute top-16 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white transition-all hover:bg-black/40 z-30"
            >
                {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                ) : (
                    <Volume2 className="w-5 h-5" />
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
                        <Heart className={`w-7 h-7 filter drop-shadow-md ${liked ? 'fill-current' : ''}`} />
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
                        <Share2 className="w-7 h-7 filter drop-shadow-md" />
                    </button>
                    <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
                </div>

                {/* More Options */}
                <button className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white transition-all active:scale-90 hover:bg-black/40">
                    <MoreHorizontal className="w-7 h-7" />
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
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
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
                            <ChevronRight className="w-3 h-3" />
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
                const response = await apiClient.get('/food');
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
                <Loader2 className="w-12 h-12 text-[#FF5E00] animate-spin" />
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
