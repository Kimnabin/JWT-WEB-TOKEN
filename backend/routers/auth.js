const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const middlewareController = require('../controllers/middlewareController');


router.post("/register", authController.registerUser );

// LOGIN
router.post("/login", authController.loginUser );

// REFRESH 
router.post("/refresh", authController.requestRefeshToken ); 

// LOGOUT
router.post("/logout", middlewareController.verifyToken, authController.logoutUser );
module.exports = router;