import { Router } from 'express';
import { forgotPassword, login, logout, resetPassword, signUp } from '../controllers/authController.js';

const router = Router();

// route for register User
router.post('/signup', signUp);

// route for login user
router.post('/login', login);

// route for logout user
router.get('/logout', logout);

// route for forgot password of user
router.post('/password/forgot', forgotPassword);

// route for reset password of user
router.post('/reset/:token', resetPassword);


export default router;