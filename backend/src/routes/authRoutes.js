import { Router } from 'express';
import { login, logout, signUp } from '../controllers/authController.js';

const router = Router();

// Register User
router.post('/signup', signUp);


// Login User
router.post('/login', login);

// Logout User
router.get('/logout', logout);


export default router;