import { Router } from 'express';
import { addCoupon, deleteCoupon, getAllCoupon, getCoupon, updateCoupon } from '../controllers/couponController.js';
import { authorize, isLoggedIn } from '../middlewares/authMiddleware.js';
import authRoles from '../utils/authRoles.js';

const router = Router();

// route for getting a coupon 
router.get("/get_coupon", isLoggedIn, authorize(authRoles.ADMIN, authRoles.MODERATOR), getCoupon);

// route for getting all the coupons
router.get("/get_coupons", isLoggedIn, authorize(authRoles.ADMIN, authRoles.MODERATOR), getAllCoupon);

// route for adding a coupon
router.post('/add_coupon', isLoggedIn, authorize(authRoles.ADMIN, authRoles.MODERATOR), addCoupon);

// route for updating a coupon
router.put("/update_coupon", isLoggedIn, authorize(authRoles.ADMIN, authRoles.MODERATOR), updateCoupon);

// route for deleting a coupon
router.delete('/delete_coupon', isLoggedIn, authorize(authRoles.ADMIN, authRoles.MODERATOR), deleteCoupon);


export default router;
