const express = require('express');
const foodcontroller = require("../controllers/food.controller")
const authmiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');
const validate = require('../middlewares/validate');
const foodValidation = require('../validations/food.validation');


const upload = multer({
    storage: multer.memoryStorage(),
});


// /api/food/ [protected]
router.post("/",
    authmiddleware.authfoodpatner,
    upload.fields([{ name: 'video', maxCount: 1 }, { name: 'images', maxCount: 4 }]),
    validate(foodValidation.createFood),
    foodcontroller.createfood);

router.get("/",
    foodcontroller.getallfood
)

router.put("/:id/like",
    authmiddleware.authAny,
    foodcontroller.toggleLike
);


router.get("/partner/:id",
    foodcontroller.getFoodByPartner
);

router.get("/:id",
    foodcontroller.getFoodById
);

router.delete("/:id",
    authmiddleware.authfoodpatner,
    foodcontroller.deleteFood
);

router.put("/:id",
    authmiddleware.authfoodpatner,
    upload.fields([{ name: 'video', maxCount: 1 }, { name: 'images', maxCount: 4 }]),
    validate(foodValidation.updateFood),
    foodcontroller.updateFood
);

// Review Routes
router.post("/review",
    authmiddleware.authUser, // Ensure only Users can review
    validate(foodValidation.addReview),
    foodcontroller.addReview
);

router.get("/:foodId/reviews",
    foodcontroller.getFoodReviews
);

module.exports = router;