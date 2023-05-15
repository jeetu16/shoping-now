import { Router } from 'express';
import {addProduct, getAllProducts} from '../controllers/productController.js';

const router = Router();

// Get all products
router.get("", getAllProducts);


// Add product
router.post("", addProduct);

export default router;