import CustomError from "../service/CustomError.js";
import asyncHandler from "../service/asyncHandler.js";
import config from '../config/index.js';
import Product from "../models/productSchema.js";
import { s3DeleteFile, s3UploadFile } from '../service/s3ImageHandler.js'
import mongoose from "mongoose";


export const addProduct = asyncHandler(async (req, res) => {

    // file upload using express-fileupload package
    if (!req.body.name || !req.body.price) {
        throw new CustomError("Please fill all the fields", 400);
    }

    if (!req.files) {
        throw new CustomError("File is missing", 400)
    }
    const files = req.files;

    const productId = new mongoose.Types.ObjectId().toHexString();

    const imgArrayRes = Promise.all(
        Object.keys(files).map(async (key, index) => {
            const element = files[key];

            const upload = await s3UploadFile({
                bucketName: config.S3_BUCKET_NAME,
                key: `products/${productId}/photo_${index + 1}.jpg`,
                body: element.data,
                contentType: element.mimetype,
                ACL: "public-read"
            })
            console.log("Upload: ", upload);

            return {
                secure_url: upload.Location
            }
        })
    )

    const imgArr = await imgArrayRes;

    const product = await Product.create({
        _id: productId,
        photos: imgArr,
        ...req.body
    })

    if (!product) {
        throw new CustomError("Product failed to be created", 500);
    }
    console.log("Image Array: ", imgArr);
    res.status(200).json({
        success: true,
        product
    })
})

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})

    if (!products) {
        throw new CustomError("No products found", 404)
    }

    res.status(200).json({
        success: true,
        products
    })
})


export const getProduct = asyncHandler(async (req, res) => {

    const { id: productId } = req.params;

    if (!productId) {
        throw new CustomError("Please Provide Product id", 400);
    }

    const product = await Product.findById({ _id: productId });

    if (!product) {
        throw new CustomError(`No product found with given id`, 404);
    }

    res.status(200).json({
        success: true,
        product
    })

})


export const getProductsByCollectionId = asyncHandler(async (req, res) => {
    const { id: collectionId } = req.params

    if (!collectionId) {
        throw new CustomError("Please provide collection Id", 400);
    }

    const products = await Product.find({ collectionId });

    if (!products) {
        throw new CustomError("Not found any product", 404);
    }

    res.status(200).json({
        success: true,
        products
    })
})

export const deleteProducts = asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    console.log(productId);

    if (!productId) {
        throw new CustomError("Please provide product id", 400);
    }

    const product = await Product.findById({ _id:productId });

    console.log(product);

    if (!product) {
        throw new CustomError("No product found", 404);
    }

    const deletePhotos = Promise.all(
        product.photos.map(async (value, key) => {
            await s3DeleteFile({
                bucketName: config.S3_BUCKET_NAME,
                key: `products/${product._id.toString()}/photo_${key + 1}.jpg`
            })
        })
    )

    await deletePhotos;

    await product.remove();

    res.status(200).json({
        success: true,
        message: "product successfully deleted"
    })



})


// file upload using formidable package

// const form = formidable({ multiples: true, keepExtensions: true });

// form.parse(req, async function (err, fields, files) {
//     if (err) {
//         throw new CustomError(err.message || "Something went wrong", 500);
//     }

//     let productId = new Mongoose.Types.ObjectId().toHexString()

//     console.log(fields, files);

//     if (!fields.name || !fields.price) {
//         throw new CustomError("Please fill all the fields", 500);
//     }

//     let imgArrayResp = Promise.all(
//         Object.keys(files).map(async (fileKey, index) => {
//             const element = files[fileKey];
//             console.log(`FileKey: ${fileKey}`);
//             console.log(`ELEMENT: ${element}`);
//             console.log(`File Path: ${element.filepath}`);
//             const data = fs.readFileSync(element.filepath)

//             const upload = await s3UploadFile({
//                 bucketName: config.S3_BUCKET_NAME,
//                 key: `products/${productId}/photo_${index + 1}.jpg`,
//                 body: data,
//                 contentType: element.mimetype
//             })

//             console.log("UPLOAD: ", upload);
//             return {
//                 secure_url: upload.Location
//             }
//         })
//     )

//     let imgArray = await imgArrayResp

//     const product = await Product.create({
//         _id: productId,
//         photos: imgArray,
//         ...fields
//     })

//     if (!product) {
//         throw new CustomError("Product failed to be created in DB", 400)
//     }
//     res.status(200).json({
//         success: true,
//         product,
//     })
// })
