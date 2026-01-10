const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

// for user auth apis
router.post('/user/register', validate(authValidation.userRegister), authController.registerUser);
router.post('/user/login', validate(authValidation.userLogin), authController.loginUser);
router.get('/user/logout', authController.logoutUser);

// for food partner auth apis
router.post('/foodpartner/register', validate(authValidation.foodPartnerRegister), authController.registerfoodpartner);
router.post('/foodpartner/login', validate(authValidation.foodPartnerLogin), authController.loginfoodpartner);
router.get('/foodpartner/logout', authController.logoutfoodpartner);
router.get('/partner/:id', authController.getPartnerById);

router.get('/user/favorites', authMiddleware.authUser, authController.getUserFavorites);

module.exports = router;