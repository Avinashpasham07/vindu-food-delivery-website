const express = require('express');
const foodcontroller = require("../controllers/food.controller")
const authmiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
});


// /api/food/ [protected]
router.post("/",
    authmiddleware.authfoodpatner,
    upload.single("video"),
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
    upload.single("video"),
    foodcontroller.updateFood
);

// Review Routes
router.post("/review",
    authmiddleware.authUser, // Ensure only Users can review
    foodcontroller.addReview
);

router.get("/:foodId/reviews",
    foodcontroller.getFoodReviews
);

module.exports = router;