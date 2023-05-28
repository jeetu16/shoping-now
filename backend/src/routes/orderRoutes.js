import { generateRazorOrderId, generateOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { Router } from 'express';
import authRoles from '../utils/authRoles.js';
import { authorize, isLoggedIn  } from '../middlewares/authMiddleware.js';


const router = Router();

// route for generating razorpay id for transaction
router.post("/razorpay", isLoggedIn, generateRazorOrderId);

// route for generating order
router.post("/order", isLoggedIn, generateOrder);

// route for getting all the order of specific user
router.get("/user_orders", isLoggedIn, getMyOrders);

// route for getting the orders for MODERATOR and ADMIN
router.get("/getorders", isLoggedIn, authorize(authRoles.ADMIN,authRoles.MODERATOR), getAllOrders);

// route for udating order status
router.get('/update', isLoggedIn, authorize(authRoles.ADMIN, authRoles.MODERATOR), updateOrderStatus);


export default router;