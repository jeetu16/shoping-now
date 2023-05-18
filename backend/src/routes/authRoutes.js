import { Router } from 'express';
import { forgotPassword, login, logout, resetPassword, signUp } from '../controllers/authController.js';

const router = Router();

// Register User
router.post('/signup', signUp);


// Login User
router.post('/login', login);

// Logout User
router.get('/logout', logout);

// Forgot password of user route
router.post('/password/forgot',forgotPassword);

// reset password route
router.post('/reset',resetPassword);


export default router;