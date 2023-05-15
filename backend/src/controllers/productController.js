import formidable from "formidable";
import CustomError from "../service/CustomError.js";
import asyncHandler from "../service/asyncHandler.js";
import config from '../config/index.js';
import fs from "fs";
import Product from "../models/productSchema.js";
import Mongoose from "mongoose";
import { s3DeleteFile, s3UploadFile } from '../service/s3ImageHandler.js'
import { log } from "console";


export const addProduct = asyncHandler(async (req, res) => {
    const form = formidable({ multiples: true, keepExtensions: true });

    form.parse(req, async function (err, fields, files) {
        if (err) {
            throw new CustomError(err.message || "Something went wrong", 500)
        }

        let productId = new Mongoose.Types.ObjectId().toHexString()

        console.log(fields, files);

        if (
            !fields.name ||
            !fields.price
        ) {
            throw new CustomError("Please fill all the fields", 500)

        }



        let imgArrayResp = Promise.all(
            Object.keys(files).map(async (fileKey, index) => {
                const element = files[fileKey];
                console.log("ELEMENT",element);
                const data = fs.readFileSync(element.filepath)
                console.log(`File Path: ${element.filepath}`);

                const upload = await s3UploadFile({
                    bucketName: config.S3_BUCKET_NAME,
                    key: `products/${productId}/photo_${index + 1}.jpg`,
                    body: data,
                    contentType: element.mimetype
                })

                // productId = 123abc456
                // 1: products/123abc456/photo_1.png
                // 2: products/123abc456/photo_2.png

                console.log("UPLOAD: ",upload);
                return {
                    secure_url: upload.Location
                }
            })
        )

        let imgArray = await imgArrayResp

        const product = await Product.create({
            _id: productId,
            photos: imgArray,
            ...fields
        })

        if (!product) {
            throw new CustomError("Product failed to be created in DB", 400)
        }
        res.status(200).json({
            success: true,
            product,
        })
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
