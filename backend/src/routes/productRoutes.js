import { Router } from 'express';
import {addProduct, deleteProducts, getAllProducts, getProduct} from '../controllers/productController.js';
import fileUpload from 'express-fileupload';

const router = Router();

// Get all products
router.get("/get_products", getAllProducts);

// Get all products
router.get("/get_product/:id", getProduct);

// Add product
router.post("/add_product",fileUpload({createParentPath:true}),addProduct);

// Delete product
router.delete("/delete_product/:id", deleteProducts);

export default router;