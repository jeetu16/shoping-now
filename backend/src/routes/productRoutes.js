import { Router } from 'express';
import {addProduct, deleteProducts, getAllProducts, getProduct} from '../controllers/productController.js';
import fileUpload from 'express-fileupload';

const router = Router();

// Get all products
router.get("", getAllProducts);

// Get all products
router.get("/:id", getProduct);

// Add product
router.post("",fileUpload({createParentPath:true}),addProduct);

// Get all products
router.delete("/:id", deleteProducts);

export default router;