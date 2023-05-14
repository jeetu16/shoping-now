import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../service/CustomError.js";
import Category from "../models/categorySchema.js";


export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new CustomError("Please provide a Category name!", 400);
    }

    const category = await Category.create({ name });

    res.status(201).json({
        success: true,
        message: "Cetegory Successfully created",
        category
    })
})

export const updateCategory = asyncHandler(async (req, res) => {
    const { id: categoryId } = req.params;
    const { name } = req.body;

    if (!categoryId) {
        throw new CustomError("Please provide category id", 400);
    }

    if (!name) {
        throw new CustomError("Please provide name for updation", 400);
    }

    const updateCategory = await Category.findByIdAndUpdate(
        { _id: categoryId },
        { name },
        { new: true, runValidators: true }
    )

    if(!updateCategory) {
        throw new CustomError(`Not found any category with id ${categoryId}`,404);
    }

    res.status(200).json({
        success:true,
        message: "Successfully updated Category name",
        updateCategory
    })
})

export const deleteCategory = asyncHandler(async(req,res) => {
    const {id: categoryId} = req.params;

    if(!categoryId) {
        throw new CustomError("Please provide category id",400);
    }

    const categoryToDelete = await Category.findOne({_id:categoryId})

    if(!categoryToDelete) {
        throw new CustomError(`Not found any category with id ${categoryId}`,404)
    }

    await categoryToDelete.remove();

    res.status(200).json({
        success:true,
        message: `Successfully deleted the category with id ${categoryId}`
    })
})

export const getAllCategories = asyncHandler(async(_req,res) => {

    const categories = await Category.find();

    if(!categories) {
        throw new CustomError("Not found any categories",404);
    }

    res.status(200).json({
        success: true,
        categories
    })
})