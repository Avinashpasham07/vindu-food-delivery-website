const foodmodel = require("../models/food.model");
const usermodel = require("../models/user.model");
const Review = require("../models/review.model");
const fs = require('fs');
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function createfood(req, res) {
    // convert to base64 for ImageKit
    // convert to base64 for ImageKit
    let videoUrl = '';
    let fileType = 'video';

    if (req.body.videoUrl) {
        videoUrl = req.body.videoUrl;
        // Simple check to see if it's an image or video URL
        const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(videoUrl);
        fileType = isImage ? 'image' : 'video';
    } else if (req.files && req.files.video) {
        const videoFile = req.files.video[0];
        const base64File = videoFile.buffer.toString("base64");
        const uploadResult = await storageService.uploadImage(base64File, uuid());
        videoUrl = uploadResult.url;
        fileType = uploadResult.fileType;
    }

    // Process Gallery Images (Parallel Upload)
    const galleryImages = [];
    if (req.body.galleryUrls) {
        const urls = req.body.galleryUrls.split(',').map(url => url.trim()).filter(url => url !== '');
        galleryImages.push(...urls);
    }

    if (req.files && req.files.images) {
        const uploadPromises = req.files.images.map(async (file) => {
            const base64 = file.buffer.toString("base64");
            const result = await storageService.uploadImage(base64, uuid());
            return result.url;
        });
        const uploadedUrls = await Promise.all(uploadPromises);
        galleryImages.push(...uploadedUrls);
    }

    const fooditem = await foodmodel.create({
        name: req.body.name,
        video: videoUrl,
        fileType: fileType,
        images: galleryImages,
        description: req.body.description,
        foodpartner: req.foodpartner._id,
        price: req.body.price,
        ingredients: req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : [],
        prepTime: req.body.prepTime,
        calories: req.body.calories,
        category: req.body.category,
        category: req.body.category,
        foodType: req.body.foodType,
        discount: req.body.discount,
        nutrition: {
            protein: Number(req.body.protein) || 0,
            carbs: Number(req.body.carbs) || 0,
            fats: Number(req.body.fats) || 0
        }
    });
    res.status(201).json({
        message: "Food item created successfully",
        food: fooditem
    });
}

async function getallfood(req, res) {
    // Senior Optimization: Limit to 100 items to prevent huge payloads
    // Ideally, implement pagination (limit/page query params)
    const limit = parseInt(req.query.limit) || 100;
    const fooditems = await foodmodel.find({})
        .populate('foodpartner', 'name')
        .sort({ createdAt: -1 }) // Newest first
        .limit(limit);

    res.status(200).json({
        message: "Food items retrieved successfully",
        fooditems
    });
}

async function toggleLike(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user._id : req.foodpartner._id;

        const food = await foodmodel.findById(id);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        const isLiked = food.likes.includes(userId);

        if (isLiked) {
            // Unlike
            food.likes = food.likes.filter(like => like.toString() !== userId.toString());
            // Remove from user favorites if it's a user
            if (req.user) {
                await usermodel.findByIdAndUpdate(userId, {
                    $pull: { favorites: id }
                });
            }
        } else {
            // Like
            food.likes.push(userId);
            // Add to user favorites if it's a user
            if (req.user) {
                await usermodel.findByIdAndUpdate(userId, {
                    $addToSet: { favorites: id }
                });
            }
        }

        await food.save();

        res.status(200).json({
            message: isLiked ? "Unliked successfully" : "Liked successfully",
            likes: food.likes,
            isLiked: !isLiked
        });
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getFoodByPartner(req, res) {
    try {
        const { id } = req.params;
        const fooditems = await foodmodel.find({ foodpartner: id });

        res.status(200).json({
            message: "Partner food items retrieved",
            fooditems
        });
    } catch (error) {
        console.error("Error fetching partner food:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getFoodById(req, res) {
    try {
        const { id } = req.params;
        const food = await foodmodel.findById(id).populate('foodpartner', 'name email address'); // Populate partner details

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.status(200).json({
            message: "Food item retrieved successfully",
            food
        });
    } catch (error) {
        console.error("Error fetching food details:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteFood(req, res) {
    try {
        const { id } = req.params;
        const food = await foodmodel.findByIdAndDelete(id);

        if (!food) {
            return res.status(404).json({ message: "Food item not found or unauthorized" });
        }

        res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        console.error("Error deleting food:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function updateFood(req, res) {
    try {
        const { id } = req.params;
        const updates = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            ingredients: req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : [],
            prepTime: req.body.prepTime,
            calories: req.body.calories,
            category: req.body.category,
            category: req.body.category,
            foodType: req.body.foodType,
            discount: req.body.discount,
            nutrition: {
                protein: Number(req.body.protein) || 0,
                carbs: Number(req.body.carbs) || 0,
                fats: Number(req.body.fats) || 0
            }
        };

        // If a new video/image is uploaded
        // If a new video/image is uploaded
        if (req.body.videoUrl) {
            updates.video = req.body.videoUrl;
            const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(req.body.videoUrl);
            updates.fileType = isImage ? 'image' : 'video';
        } else if (req.files && req.files.video) {
            const videoFile = req.files.video[0];
            const base64File = videoFile.buffer.toString("base64");
            const uploadResult = await storageService.uploadImage(base64File, uuid());
            updates.video = uploadResult.url;
            updates.fileType = uploadResult.fileType;
        }

        // Handle Gallery Images
        let currentGallery = [];
        if (req.body.existingImages) {
            // Use the list provided by the frontend as the base
            currentGallery = req.body.existingImages.split(',').map(url => url.trim()).filter(url => url !== '');
        } else {
            // Fallback to current DB state if not provided (safety)
            const currentFood = await foodmodel.findById(id);
            if (currentFood) {
                currentGallery = [...currentFood.images];
            }
        }

        if (req.body.galleryUrls) {
            const urls = req.body.galleryUrls.split(',').map(url => url.trim()).filter(url => url !== '');
            currentGallery = [...currentGallery, ...urls];
        }

        if (req.files && req.files.images) {
            const uploadPromises = req.files.images.map(async (file) => {
                const base64 = file.buffer.toString("base64");
                const result = await storageService.uploadImage(base64, uuid());
                return result.url;
            });
            const uploadedUrls = await Promise.all(uploadPromises);
            currentGallery = [...currentGallery, ...uploadedUrls];
        }

        // Always update images if we've processed gallery related fields or if it's explicitly about removal
        if (req.body.galleryUrls || (req.files && req.files.images) || req.body.existingImages) {
            updates.images = currentGallery;
        }

        const food = await foodmodel.findOneAndUpdate(
            { _id: id, foodpartner: req.foodpartner._id },
            updates,
            { new: true }
        );

        if (!food) {
            return res.status(404).json({ message: "Food item not found or unauthorized" });
        }

        res.status(200).json({ message: "Food item updated successfully", food });
    } catch (error) {
        console.error("Error updating food:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Add Review
const addReview = async (req, res) => {
    try {
        const { foodId, rating, comment } = req.body;
        const userId = req.user._id; // Assuming user is authenticated and attached to req

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: "Rating and comment are required" });
        }

        const food = await foodmodel.findById(foodId);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Create new review
        const newReview = new Review({
            user: userId,
            food: foodId,
            rating,
            comment
        });

        await newReview.save();

        // Recalculate average rating
        const reviews = await Review.find({ food: foodId });
        const totalReviews = reviews.length;
        const sumRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalReviews > 0 ? (sumRatings / totalReviews) : 0;

        // Update food item
        const updatedFood = await foodmodel.findByIdAndUpdate(foodId, {
            totalReviews: totalReviews,
            averageRating: parseFloat(averageRating.toFixed(1))
        }, { new: true });

        // Populate user details for the response
        await newReview.populate('user', 'fullname profileImage');

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview,
            averageRating: updatedFood.averageRating,
            totalReviews: updatedFood.totalReviews
        });

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Error adding review" });
    }
};

// Get Reviews for a Food Item
const getFoodReviews = async (req, res) => {
    try {
        const { foodId } = req.params;
        const reviews = await Review.find({ food: foodId })
            .populate('user', 'fullname profileImage') // Populate user details
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
};

module.exports = { createfood, getallfood, toggleLike, getFoodByPartner, getFoodById, deleteFood, updateFood, addReview, getFoodReviews };