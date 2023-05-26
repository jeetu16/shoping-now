import { Router } from 'express';
import { addCoupon, deleteCoupon, getAllCoupon, getCoupon, updateCoupon } from '../controllers/couponController.js';

const router = Router();

// get a coupon 
router.get("/get_coupon",getCoupon);

// get all the coupons
router.get("/get_coupons",getAllCoupon);

// add coupon
router.post('/add_coupon',addCoupon);

// update a coupon
router.put("/update_coupon",updateCoupon);

// add delete coupons
router.delete('/delete_coupon', deleteCoupon);


export default router;
