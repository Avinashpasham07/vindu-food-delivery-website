import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const FoodDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, getItemQuantity, decrementItem } = useCart();
    const { showToast } = useToast();

    // State
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    // Reviews & Rating State
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get(`/food/${id}/reviews`);
                if (response.data.success) {
                    setReviews(response.data.reviews);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        if (id) fetchReviews();
    }, [id]);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const response = await apiClient.get(`/food/${id}`);
                setFood(response.data.food);
            } catch (error) {
                console.error("Error fetching food details:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchFoodDetails();
        }
    }, [id]);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (!food) return;

        // Create cart item object
        const cartItem = {
            _id: food._id,
            name: food.name,
            price: food.price,
            image: food.image,
            video: food.video,
            fileType: food.fileType,
            description: food.description
        };

        addToCart(cartItem, quantity);

        // Optional: Navigate to cart or show success
        navigate('/cart');
        showToast(`Added ${quantity} x ${food.name} to cart!`, 'success');
    };

    // Check initial like status
    useEffect(() => {
        if (food && user && food.likes) {
            setIsLiked(food.likes.includes(user.id || user._id));
        }
    }, [food, user]);

    const handleToggleLike = async () => {
        if (!user) {
            showToast("Please login to like items", 'error');
            return;
        }

        // Optimistic UI update
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        if (newLikedState) {
            showToast("Added to your favorites!", 'success');
        } else {
            showToast("Removed from favorites", 'info');
        }

        try {
            await apiClient.put(`/food/${id}/like`);
            // Background sync not strictly necessary if optimistic succeeds
        } catch (error) {
            console.error("Error toggling like:", error);
            setIsLiked(!newLikedState); // Revert on failure
            showToast("Failed to update favorite", 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5E00]"></div>
            </div>
        );
    }

    if (!food) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-2xl font-bold mb-4">Item not found</h2>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#FF5E00] rounded-full font-bold">Go Home</button>
            </div>
        );
    }

    // Nutrition Data (use food data or defaults)
    const macros = {
        protein: { value: food.nutrition?.protein || 0, total: 100, unit: 'g', color: 'bg-orange-500' },
        carbs: { value: food.nutrition?.carbs || 0, total: 100, unit: 'g', color: 'bg-blue-500' },
        fats: { value: food.nutrition?.fats || 0, total: 100, unit: 'g', color: 'bg-yellow-500' }
    };



    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast("Please login to review", 'error');
            return;
        }

        setSubmittingReview(true);
        try {
            const response = await apiClient.post('/food/review', {
                foodId: id,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });

            if (response.data.success) {
                // Add new review to top of list
                setReviews([response.data.review, ...reviews]);
                // Update local food rating display
                setFood(prev => ({
                    ...prev,
                    averageRating: response.data.averageRating,
                    totalReviews: response.data.totalReviews
                }));
                // Reset form
                setReviewForm({ rating: 5, comment: '' });
                showToast("Review submitted successfully!", 'success');
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            showToast("Failed to submit review", 'error');
        } finally {
            setSubmittingReview(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-['Plus_Jakarta_Sans'] pb-36">

            {/* ... (Header & Media sections same as before) ... */}

            {/* Header / Back Button */}
            <div className="fixed top-0 left-0 w-full z-50 p-4 pt-6 md:pt-4 flex justify-between items-center pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-all hover:bg-black/60"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button
                    onClick={handleToggleLike}
                    className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-all hover:bg-black/60"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "#EF4444" : "none"} viewBox="0 0 24 24" strokeWidth={2.5} stroke={isLiked ? "none" : "currentColor"} className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'text-red-500' : 'text-white'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
            </div>

            {/* Media Section */}
            <div className="relative w-full h-[55vh] lg:h-[65vh] bg-[#1a1a1a] overflow-hidden">
                {food.fileType === 'image' ? (
                    <img src={food.video} alt={food.name} className="w-full h-full object-cover scale-[1.02] transform transition-transform duration-[2s] hover:scale-110" />
                ) : (
                    <video
                        src={food.video}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent"></div>
            </div>



            {/* Content Container */}
            <div className="px-5 md:px-8 -mt-16 relative z-10">
                {/* Title Section */}
                <div className="flex justify-between items-start mb-6 animate-slide-up">
                    <h1 className="text-3xl md:text-5xl font-black leading-[1.1] text-white drop-shadow-xl flex-1 mr-4 tracking-tight">
                        {food.name}
                    </h1>
                    <div className="flex flex-col items-end gap-1.5 pt-1">
                        <div className="bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/20 flex items-center gap-1.5 shadow-lg">
                            <span className="text-sm md:text-base font-black">{food.averageRating || 0}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yellow-500">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest">{food.totalReviews || 0} Reviews</span>
                    </div>
                </div>

                {/* Partner Pill */}
                <div className="flex items-center gap-3 mb-8 bg-[#1a1a1a] p-1.5 pr-5 rounded-full w-max border border-white/5 active:scale-95 transition-transform animate-slide-up animation-delay-100">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF5E00] to-orange-700 p-[1px]">
                        <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                            <span className="text-sm font-bold text-white">{food.foodpartner?.name?.[0] || 'P'}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white mb-0 leading-none">
                            {food.foodpartner?.name || 'Restaurant Partner'}
                        </p>
                        <span className="text-[10px] text-[#FF5E00] font-medium">Verified Partner</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed text-[15px] md:text-base font-medium opacity-90 mb-8 animate-slide-up animation-delay-200">
                    {food.description || "Experience the perfect balance of flavors with this signature dish. Freshly prepared with premium ingredients for an unforgettable taste."}
                </p>
                {food.images && food.images.length > 0 && (
                    <div className="mb-10 animate-slide-up animation-delay-300">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Details</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
                            {food.images.map((img, i) => (
                                <div key={i} className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden border border-white/10 snap-center bg-zinc-900">
                                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover " />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Nutrition / Macros Section */}
                <div className="mb-8 animate-slide-up animation-delay-300">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Nutrition</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {Object.entries(macros).map(([key, data]) => (
                            <div key={key} className="bg-[#1a1a1a] p-4 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className={`absolute bottom-0 left-0 h-1 ${data.color} w-full opacity-50`}></div>
                                <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-wider">{key}</p>
                                <p className="text-xl font-black text-white">{data.value}{data.unit}</p>
                                <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                                    <div className={`h-full ${data.color} rounded-full`} style={{ width: `${(data.value / data.total) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ingredients */}
                <div className="mb-10 animate-slide-up animation-delay-300">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Key Ingredients</h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                        {(food.ingredients && food.ingredients.length > 0 ? food.ingredients : ['Fresh Herbs', 'Organic Spices', 'Premium Choice']).map((tag, i) => (
                            <span key={i} className="whitespace-nowrap px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#222] rounded-xl text-xs font-bold text-gray-300 border border-white/5 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Gallery Section (Correct Placement) */}


                {/* Reviews Section */}
                <div className="mb-12 animate-slide-up animation-delay-300">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reviews ({reviews.length})</h3>
                        <span className="text-[#FF5E00] text-xs font-bold cursor-pointer hover:underline">View All</span>
                    </div>

                    {/* Write Review Form (Only if User) */}
                    {user && (
                        <form onSubmit={handleReviewSubmit} className="mb-6 bg-[#1a1a1a] p-4 rounded-2xl border border-white/5">
                            <h4 className="text-sm font-bold mb-3">Rate this Item</h4>
                            <div className="flex gap-2 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-600'}`}>
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                placeholder="Write your review here..."
                                className="w-full bg-[#0d0d0d] rounded-xl p-3 text-sm text-white border border-white/10 focus:border-[#FF5E00] focus:outline-none mb-3 resize-none h-20"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="w-full bg-white text-black py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {submittingReview ? 'Submitting...' : 'Post Review'}
                            </button>
                        </form>
                    )}

                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
                        {reviews.length === 0 ? (
                            <div className="w-full text-center py-6 text-gray-500 text-sm">No reviews yet. Be the first to review!</div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="min-w-[260px] bg-[#1a1a1a] p-5 rounded-[24px] border border-white/5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5E00] to-orange-400 flex items-center justify-center text-xs font-bold text-white uppercase">
                                                {review.user?.fullname ? review.user.fullname[0] : 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">{review.user?.fullname || 'User'}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-400 text-xs leading-relaxed mb-3">"{review.comment}"</p>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500' : 'text-gray-700'}`}>
                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Sticky Action Bar - Hidden for Partners */}
            {localStorage.getItem('userType') !== 'partner' && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
                    {getItemQuantity(food._id) === 0 ? (
                        /* Initial Add State */
                        <div className="bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl shadow-black/80">
                            <button
                                onClick={() => {
                                    addToCart({
                                        _id: food._id,
                                        name: food.name,
                                        price: food.price,
                                        image: food.image,
                                        video: food.video,
                                        fileType: food.fileType,
                                        description: food.description
                                    }, 1);
                                    showToast(`Added ${food.name} to cart!`, 'success');
                                }}
                                className="w-full h-[60px] bg-gradient-to-r from-[#FF5E00] to-[#ff8c00] text-white rounded-[2rem] shadow-lg shadow-orange-500/20 active:scale-95 transition-all hover:shadow-orange-500/40 flex items-center justify-between px-6 group overflow-hidden relative cursor-pointer"
                            >
                                <span className="text-lg font-black tracking-wide uppercase">Add to Order</span>
                                <span className="text-xl font-black">₹{food.price}</span>
                            </button>
                        </div>
                    ) : (
                        /* Active Cart State */
                        <div className="bg-[#111]/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50 flex items-center justify-between gap-3">
                            {/* Qty Controls */}
                            <div className="flex items-center gap-3 bg-black/40 rounded-[2rem] p-1.5 pl-2 border border-white/5">
                                <button
                                    onClick={() => decrementItem(food._id)}
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                    </svg>
                                </button>
                                <span className="text-white font-bold text-xl w-8 text-center tabular-nums">{getItemQuantity(food._id)}</span>
                                <button
                                    onClick={() => addToCart({
                                        _id: food._id,
                                        name: food.name,
                                        price: food.price,
                                        image: food.image,
                                        video: food.video,
                                        fileType: food.fileType,
                                        description: food.description
                                    }, 1)}
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>

                            {/* View Cart / Total Button */}
                            <button
                                onClick={() => navigate('/cart')}
                                className="flex-1 h-[60px] bg-[#FF5E00] text-white rounded-[2rem] shadow-lg shadow-orange-500/20 active:scale-95 transition-all hover:bg-[#e65500] flex items-center justify-between px-6 group cursor-pointer"
                            >
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] uppercase font-bold text-orange-100/80 tracking-wider mb-0.5">Total</span>
                                    <span className="text-xl font-black">₹{(food.price || 0) * getItemQuantity(food._id)}</span>
                                </div>
                                <div className="bg-white/20 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FoodDetails;
