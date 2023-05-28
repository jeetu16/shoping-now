import { Router } from "express";
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js'
import couponRoutes from './couponRoutes.js';
import orderRoutes from './orderRoutes.js';
import categoryRoutes from './categoryRoutes.js';

const router = Router();


// different base route

router.use('/auth', authRoutes);
router.use("/product", productRoutes);
router.use("/coupon", couponRoutes);
router.use("/order", orderRoutes);
router.use('/category', categoryRoutes);

export default router;