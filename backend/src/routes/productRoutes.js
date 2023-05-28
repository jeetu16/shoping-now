import { Router } from 'express';
import { addProduct, deleteProducts, getAllProducts, getProduct } from '../controllers/productController.js';
import fileUpload from 'express-fileupload';
import { isLoggedIn, authorize } from '../middlewares/authMiddleware.js';
import authRoles from '../utils/authRoles.js';


const router = Router();

// route for getting all products
router.get("/get_products", getAllProducts);

// route for getting a product
router.get("/get_product/:id", getProduct);

// route for adding a product
router.post("/add_product", isLoggedIn, authorize(authRoles.ADMIN), fileUpload({ createParentPath: true }), addProduct);

// route for deleting a product
router.delete("/delete_product/:id", isLoggedIn, authorize(authRoles.ADMIN), deleteProducts);

export default router;