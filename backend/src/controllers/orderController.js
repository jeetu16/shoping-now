import Coupon from '../models/couponSchema.js';
import Product from '../models/productSchema.js';
import Order from '../models/orderSchema.js';
import razorpay from '../config/razorpayConfig';
import asyncHandler from '../service/asyncHandler.js';
import CustomError from '../service/CustomError.js';


// generate razorpay order id

export const generateRazorOrderId = asyncHandler(async(req,res) => {
    const { products, couponCode } = req.body;

    if(!products || products.length ===0 ) {
        throw new CustomError("Please provide product", 400);
    }

    let totalAmount = 0;
    let discountAmount = 0;

    // for the security purpose we are calculating products price from database
    let calculatePrice = Promise.all(
        products.map(async(product) => {
            const {productId, count} = product;
            const findProduct = await Product.findById(productId);

            if(!findProduct) {
                throw new CustomError("Product not found",404);
            }

            if(findProduct.stock < count) {
                throw new CustomError("Product quality not available", 400);
            }

            totalAmount += findProduct.price * count;
        })
    )

    // checking and validating if any coupon user have
    if(couponCode) {
        let coupon = await Coupon.findOne({code: couponCode});

        if(!coupon) {
            throw new CustomError("No such coupon found", 404);
        }

        if(!coupon?.active || coupon.couponExpiresIn < Date.now()) {
            throw new CustomError("Coupon has Expired",400)
        }

        discountAmount = totalAmount * (coupon.discount/100);

        totalAmount = totalAmount - discountAmount;
    }

    const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if(!order) {
        throw new CustomError("Transaction Failed",400);
    }

    res.status(200).json({
        success: true,
        message: "Razorpay orderId successfully generated",
        order
    })
    
})