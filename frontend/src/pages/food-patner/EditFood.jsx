import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../../App.css';

const EditFood = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        ingredients: '',
        prepTime: '',
        calories: '',
        category: 'Starters',
        foodType: 'Veg',
        discount: '',
        protein: '',
        carbs: '',
        fats: ''
    });
    const [videoFile, setVideoFile] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [fileType, setFileType] = useState(null);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/food/${id}`);
                const food = response.data.food;
                setFormData({
                    name: food.name,
                    description: food.description,
                    price: food.price,
                    ingredients: food.ingredients.join(', '), // Convert array back to string
                    prepTime: food.prepTime,
                    calories: food.calories,
                    category: food.category || 'Starters',
                    foodType: food.foodType || 'Veg',
                    discount: food.discount || '',
                    protein: food.nutrition?.protein || '',
                    carbs: food.nutrition?.carbs || '',
                    fats: food.nutrition?.fats || ''
                });
                setCurrentVideo(food.video);
                setFileType(food.fileType);
            } catch (error) {
                console.error("Error fetching food details:", error);
                alert("Failed to load food details.");
                navigate('/partner/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchFoodDetails();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('ingredients', formData.ingredients);
        data.append('prepTime', formData.prepTime);
        data.append('calories', formData.calories);
        data.append('category', formData.category);
        data.append('foodType', formData.foodType);
        data.append('discount', formData.discount);
        data.append('protein', formData.protein);
        data.append('carbs', formData.carbs);
        data.append('fats', formData.fats);

        if (videoFile) {
            data.append('video', videoFile);
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/food/${id}`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('Food item updated successfully!');
                navigate('/partner/dashboard');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update food item';
            alert(errorMessage);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0d0d0d] text-white font-['Plus_Jakarta_Sans']">
            <div className="relative hidden lg:flex flex-1 flex-col justify-between p-[60px] bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2674&auto=format&fit=crop')" }}>

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-[1]"></div>

                <div className="relative z-[2] max-w-[480px]">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-[30px] font-semibold text-sm mb-6 border border-white/20">
                        Partner Dashboard
                    </div>
                    <h1 className="text-5xl font-extrabold leading-[1.1] m-0 mb-5 tracking-tight">
                        Edit Menu Item
                    </h1>
                    <p className="text-lg text-white/80 leading-relaxed">
                        Update details for your dish.
                    </p>
                </div>
            </div>

            <div className="flex-none w-full lg:w-[500px] bg-[#0d0d0d] flex flex-col justify-center p-[30px] lg:p-[40px_60px] relative border-l border-[#333]">
                <div className="absolute top-[20px] lg:top-[40px] right-[20px] lg:right-[60px]">
                    <Link to="/partner/dashboard" className="text-sm text-[#a1a1aa] no-underline font-medium hover:text-white transition-colors">
                        Cancel
                    </Link>
                </div>
                <div className="mb-10 mt-10 lg:mt-0">
                    <h2 className="text-[32px] font-bold m-0 mb-2.5">Edit Food Item</h2>
                    <p className="text-[#a1a1aa] text-[15px]">Make changes to your dish.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Food Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="description" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Description</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="price" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Price (₹)</label>
                        <div className="relative">
                            <input
                                type="number"
                                id="price"
                                placeholder="e.g. 299"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                            <label htmlFor="calories" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Calories</label>
                            <input
                                type="text"
                                id="calories"
                                placeholder="e.g. 450 kcal"
                                value={formData.calories}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                        </div>
                        <div>
                            <label htmlFor="prepTime" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Prep Time</label>
                            <input
                                type="text"
                                id="prepTime"
                                placeholder="e.g. 20-30 min"
                                value={formData.prepTime}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="ingredients" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Ingredients</label>
                        <input
                            type="text"
                            id="ingredients"
                            placeholder="Comma separated (e.g. Chicken, Spices)"
                            value={formData.ingredients}
                            onChange={handleChange}
                            className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                        />
                    </div>

                    {/* Nutrition Section */}
                    <div className="mb-5">
                        <label className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Nutrition (g)</label>
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                type="number"
                                id="protein"
                                placeholder="Protein"
                                value={formData.protein}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                            <input
                                type="number"
                                id="carbs"
                                placeholder="Carbs"
                                value={formData.carbs}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                            <input
                                type="number"
                                id="fats"
                                placeholder="Fats"
                                value={formData.fats}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="discount" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Discount / Offer Tag (Optional)</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="discount"
                                placeholder="e.g. 50% OFF, BUY 1 GET 1"
                                value={formData.discount}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                            <label htmlFor="category" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Category</label>
                            <div className="relative">
                                <select
                                    id="category"
                                    value={formData.category} // Ensure this matches state key
                                    onChange={handleChange}
                                    className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10 appearance-none cursor-pointer"
                                >
                                    {['Starters', 'Main Course', 'Desserts', 'Beverages', 'Snacks', 'Biryani', 'Pizza', 'Burger', 'Healthy', 'Thali'].map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Food Type</label>
                            <div className="flex gap-4 h-[54px] items-center">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.foodType === 'Veg' ? 'border-green-500' : 'border-[#333] group-hover:border-green-500/50'}`}>
                                        {formData.foodType === 'Veg' && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="foodType"
                                        value="Veg"
                                        checked={formData.foodType === 'Veg'}
                                        onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                                        className="hidden"
                                    />
                                    <span className={`text-[15px] transition-colors ${formData.foodType === 'Veg' ? 'text-green-500 font-bold' : 'text-gray-400 group-hover:text-white'}`}>Veg</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.foodType === 'Non-Veg' ? 'border-red-500' : 'border-[#333] group-hover:border-red-500/50'}`}>
                                        {formData.foodType === 'Non-Veg' && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="foodType"
                                        value="Non-Veg"
                                        checked={formData.foodType === 'Non-Veg'}
                                        onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                                        className="hidden"
                                    />
                                    <span className={`text-[15px] transition-colors ${formData.foodType === 'Non-Veg' ? 'text-red-500 font-bold' : 'text-gray-400 group-hover:text-white'}`}>Non-Veg</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="video" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">New Video/Image (Optional)</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="video"
                                onChange={handleFileChange}
                                className="w-full p-[10px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#333] file:text-white hover:file:bg-[#444] cursor-pointer"
                            />
                        </div>
                        {currentVideo && !videoFile && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Current File:</p>
                                {fileType === 'image' ? (
                                    <img src={currentVideo} alt="Current" className="h-20 rounded-md object-cover" />
                                ) : (
                                    <video src={currentVideo} className="h-20 rounded-md object-cover" />
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#10B981] text-white p-[14px] rounded-xl font-bold text-[15px] hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/20 active:scale-[0.98]"
                    >
                        Update Dish
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/partner/dashboard')}
                        className="w-full bg-[#1a1a1a] text-white p-[14px] rounded-xl font-bold text-[15px] hover:bg-[#222] transition-all mt-3 border border-[#333]"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditFood;
