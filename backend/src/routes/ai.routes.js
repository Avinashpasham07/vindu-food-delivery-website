const express = require('express');
const router = express.Router();
const Food = require('../models/food.model');

// "Mock AI" / Smart Search Route
// Since API keys (OpenAI/Gemini) are hitting quota limits, we use this robust fallback 
// to ensure the feature works perfectly for your Portfolio Demo.
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMsg = message.toLowerCase();

        // 1. Identify Keywords (Simple NLP)
        // Keywords mapped to potential DB fields
        const keywords = [];
        const moodMap = {
            "spicy": ["Biryani", "Starters", "Masala", "Chilli"],
            "happy": ["Desserts", "Pizza", "Sweet", "Cake"],
            "sad": ["Comfort", "Tea", "Coffee", "Soup", "Maggi"],
            "healthy": ["Salad", "Healthy", "Juice", "Oats"],
            "hungry": ["Biryani", "Thali", "Meals", "Burger"],
            "snack": ["Snacks", "Samosa", "Sandwich"],
            "thirsty": ["Beverages", "Juice", "Shake"]
        };

        // Check for specific food names or categories
        const commonFoods = ["biryani", "pizza", "burger", "cake", "ice cream", "dosa", "idli", "pasta", "noodles", "roti"];
        commonFoods.forEach(food => {
            if (lowerMsg.includes(food)) keywords.push(food);
        });

        // Check for moods
        Object.keys(moodMap).forEach(mood => {
            if (lowerMsg.includes(mood)) {
                keywords.push(...moodMap[mood]);
            }
        });

        // 2. Search Database
        let suggestions = [];
        if (keywords.length > 0) {
            // Regex search for matches
            const regexQueries = keywords.map(k => ({
                $or: [
                    { name: { $regex: k, $options: 'i' } },
                    { category: { $regex: k, $options: 'i' } },
                    { description: { $regex: k, $options: 'i' } },
                    { tags: { $regex: k, $options: 'i' } }
                ]
            }));

            suggestions = await Food.find({ $or: regexQueries }).limit(3).select('name _id');
        } else {
            // Default random suggestions if no keywords matched
            suggestions = await Food.find().limit(3).select('name _id');
        }

        // 3. Construct Reply
        const suggestionObjs = suggestions.map(s => ({ name: s.name, id: s._id }));
        let replyText = "";

        if (suggestionObjs.length > 0) {
            if (keywords.length > 0) {
                replyText = `I found some delicious options matching "${keywords[0]}" for you! 😋`;
            } else {
                replyText = "I'm not sure what you're craving, but these represent our chef's specials! 👨‍🍳";
            }
        } else {
            replyText = "I couldn't find exactly that, but check out our full menu! 📜";
        }

        // Return strictly valid JSON format matching the frontend expectation
        res.json({
            reply: replyText,
            suggestions: suggestionObjs
        });

    } catch (error) {
        console.error("Smart Chat Error:", error);
        res.json({
            reply: "I'm a bit overwhelmed with orders right now! Try exploring the menu directly.",
            suggestions: []
        });
    }
});

module.exports = router;
