import { Router } from 'express';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/categoryController.js';
import { authorize, isLoggedIn } from '../middlewares/authMiddleware.js';
import authRoles from '../utils/authRoles.js';


const router = Router();

// route for getting all category list
router.get("/all_categories", getAllCategories);


// route for add category
router.post('/add_category', isLoggedIn, authorize(authRoles.ADMIN));

// route for updating category
router.put('/update_category/:id',isLoggedIn, authorize(authRoles.ADMIN));

// route for deleting the category
router.put('/delete_category/:id', isLoggedIn, authorize(authRoles.ADMIN));



export default router;