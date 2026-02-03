import React from 'react';
import apiClient from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import '../../App.css';

const CreateFood = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
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
        fats: '',
        videoUrl: '',
        galleryUrls: ''
    });
    const [videoFile, setVideoFile] = React.useState(null);
    const [galleryFiles, setGalleryFiles] = React.useState([]);
    const [mediaMode, setMediaMode] = React.useState('upload'); // 'upload' or 'url'
    const [galleryMode, setGalleryMode] = React.useState('upload'); // 'upload' or 'url'

    const [videoPreview, setVideoPreview] = React.useState(null);
    const [galleryPreviews, setGalleryPreviews] = React.useState([]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Instant preview for URLs
        if (id === 'videoUrl') {
            setVideoPreview(value);
        }
        if (id === 'galleryUrls') {
            const urls = value.split(',').map(url => url.trim()).filter(url => url !== '');
            setGalleryPreviews(urls);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);
        if (file) {
            setVideoPreview(URL.createObjectURL(file));
        } else {
            setVideoPreview(null);
        }
    };

    const handleGalleryFileChange = (e) => {
        const files = Array.from(e.target.files);
        setGalleryFiles(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setGalleryPreviews(previews);
    };

    const [galleryUrlInput, setGalleryUrlInput] = React.useState(''); // State for the single URL input

    const handleAddGalleryUrl = () => {
        if (galleryUrlInput.trim()) {
            const newUrls = [...galleryPreviews, galleryUrlInput.trim()];
            setGalleryPreviews(newUrls);
            setGalleryUrlInput(''); // Clear input after adding

            // Update formData so handleSubmit has access to the full list stringified
            setFormData(prev => ({ ...prev, galleryUrls: newUrls.join(',') }));
        }
    };

    const handleRemoveGalleryUrl = (indexToRemove) => {
        const newUrls = galleryPreviews.filter((_, index) => index !== indexToRemove);
        setGalleryPreviews(newUrls);
        setFormData(prev => ({ ...prev, galleryUrls: newUrls.join(',') }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mediaMode === 'upload' && !videoFile) {
            alert("Please upload a video/image.");
            return;
        }

        if (mediaMode === 'url' && !formData.videoUrl) {
            alert("Please provide a video/image URL.");
            return;
        }

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

        if (mediaMode === 'url') {
            data.append('videoUrl', formData.videoUrl);
        } else {
            data.append('video', videoFile);
        }

        if (galleryMode === 'url') {
            // Use the list we've built
            data.append('galleryUrls', galleryPreviews.join(','));
        } else if (galleryFiles.length > 0) {
            Array.from(galleryFiles).forEach((file) => {
                data.append('images', file); // 'images' matches backend field name
            });
        }

        try {
            const response = await apiClient.post('/food', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                alert('Food item created successfully!');
                navigate('/partner/dashboard');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create food item';
            alert(errorMessage);
        }
    };

    const isImageUrl = (url) => {
        return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url) || url.startsWith('blob:');
    };

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
                        Add New Menu Item
                    </h1>
                    <p className="text-lg text-white/80 leading-relaxed">
                        case your best dishes with videos and descriptions.
                    </p>
                </div>
            </div>

            <div className="flex-none w-full lg:w-[500px] bg-[#0d0d0d] flex flex-col justify-center p-[30px] lg:p-[40px_60px] relative border-l border-[#333]">
                <div className="absolute top-[20px] lg:top-[40px] right-[20px] lg:right-[60px]">
                    <Link to="/home" className="text-sm text-[#a1a1aa] no-underline font-medium hover:text-white transition-colors">
                        Home
                    </Link>
                </div>
                <div className="mb-10 mt-10 lg:mt-0">
                    <h2 className="text-[32px] font-bold m-0 mb-2.5">Create Food Item</h2>
                    <p className="text-[#a1a1aa] text-[15px]">Add details about your dish.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Food Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                placeholder="e.g. Spicy Chicken Burger"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="description" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Description</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="description"
                                placeholder="Describe the ingredients and taste"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label htmlFor="price" className="block text-[13px] font-semibold text-[#a1a1aa] mb-2">Price (₹)</label>
                            <input
                                type="number"
                                id="price"
                                placeholder="299"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                            />
                        </div>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
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
                        <div>
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
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10 appearance-none cursor-pointer"
                                >
                                    {['Starters', 'Desserts', 'Beverages', 'Snacks', 'Biryani', 'Pizza', 'Burger', 'Healthy', 'Thali'].map((cat) => (
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
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="video" className="block text-[13px] font-semibold text-[#a1a1aa]">Main Video/Image</label>
                            <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-[#333]">
                                <button
                                    type="button"
                                    onClick={() => { setMediaMode('upload'); setVideoPreview(videoFile ? URL.createObjectURL(videoFile) : null); }}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${mediaMode === 'upload' ? 'bg-[#10B981] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMediaMode('url'); setVideoPreview(formData.videoUrl); }}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${mediaMode === 'url' ? 'bg-[#10B981] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
                                >
                                    URL
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            {mediaMode === 'upload' ? (
                                <input
                                    type="file"
                                    id="video"
                                    accept="video/*,image/*"
                                    required={mediaMode === 'upload'}
                                    onChange={handleFileChange}
                                    className="w-full p-[10px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#10B981]/10 file:text-[#10B981] hover:file:bg-[#10B981]/20"
                                />
                            ) : (
                                <input
                                    type="url"
                                    id="videoUrl"
                                    placeholder="Paste video or image URL here"
                                    required={mediaMode === 'url'}
                                    value={formData.videoUrl}
                                    onChange={handleChange}
                                    className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                                />
                            )}
                        </div>
                        {videoPreview && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                {isImageUrl(videoPreview) ? (
                                    <img src={videoPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-[#333]" />
                                ) : (
                                    <video src={videoPreview} className="w-full h-40 object-cover rounded-xl border border-[#333]" controls />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="gallery" className="block text-[13px] font-semibold text-[#a1a1aa]">Gallery Images</label>
                            <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-[#333]">
                                <button
                                    type="button"
                                    onClick={() => { setGalleryMode('upload'); const previews = Array.from(galleryFiles).map(file => URL.createObjectURL(file)); setGalleryPreviews(previews); }}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${galleryMode === 'upload' ? 'bg-[#10B981] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setGalleryMode('url'); setGalleryPreviews([]); }}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${galleryMode === 'url' ? 'bg-[#10B981] text-white' : 'text-[#a1a1aa] hover:text-white'}`}
                                >
                                    URLs
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            {galleryMode === 'upload' ? (
                                <>
                                    <input
                                        type="file"
                                        id="gallery"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGalleryFileChange}
                                        className="w-full p-[10px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#10B981]/10 file:text-[#10B981] hover:file:bg-[#10B981]/20"
                                    />
                                    <div className="flex justify-between mt-2">
                                        <p className="text-xs text-gray-500">Select multiple images.</p>
                                        {galleryFiles.length > 0 && (
                                            <p className="text-xs text-[#10B981] font-bold">{galleryFiles.length} file(s) selected</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Paste image URL here"
                                            value={galleryUrlInput}
                                            onChange={(e) => setGalleryUrlInput(e.target.value)}
                                            className="w-full p-[14px_16px] bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-[15px] outline-none transition-all placeholder:text-gray-600 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddGalleryUrl}
                                            className="px-6 bg-[#10B981] rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Add images one by one.</p>
                                </>
                            )}
                        </div>
                        {galleryPreviews.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">Gallery Preview (Click to remove):</p>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative group min-w-[64px]">
                                            <img
                                                src={preview}
                                                alt={`Gallery ${index}`}
                                                className="h-16 w-16 rounded-md object-cover border border-[#333] transition-all group-hover:brightness-50"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGalleryUrl(index)}
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md"
                                                title="Remove image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="w-full p-4 rounded-xl border-none text-white text-base font-bold cursor-pointer bg-gradient-to-br from-[#10B981] to-[#34D399] transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg mt-2.5" type="submit">
                        Create Food
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;