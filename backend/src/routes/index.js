import { Router } from "express";
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js'
import couponRoutes from './couponRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use("/product", productRoutes);
router.use("/coupon",couponRoutes);


export default router;