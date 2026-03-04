const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    registerUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Auth Routes Public
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    registerUser
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    loginUser
);

router.get('/verify/:token', verifyEmail);

router.post(
    '/forgotpassword',
    [check('email', 'Please include a valid email').isEmail()],
    forgotPassword
);

router.put(
    '/resetpassword/:token',
    [check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })],
    resetPassword
);

// User Profile Routes (Protected)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;
