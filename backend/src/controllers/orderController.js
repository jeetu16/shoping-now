import Coupon from '../models/couponSchema.js';
import Product from '../models/productSchema.js';
import Order from '../models/orderSchema.js';
import razorpay from '../config/razorpayConfig';
import asyncHandler from '../service/asyncHandler.js';
import CustomError from '../service/CustomError.js';


// generate razorpay order id

export const generateRazorOrderId = asyncHandler(async (req, res) => {
    const { products, couponCode } = req.body;

    if (!products || products.length === 0) {
        throw new CustomError("Please provide product", 400);
    }

    let totalAmount = 0;
    let discountAmount = 0;

    // for the security purpose we are calculating products price from database
    let calculatePrice = Promise.all(
        products.map(async (product) => {
            const { productId, count } = product;
            const findProduct = await Product.findById(productId);

            if (!findProduct) {
                throw new CustomError("Product not found", 404);
            }

            if (findProduct.stock < count) {
                throw new CustomError("Product quality not available", 400);
            }

            totalAmount += findProduct.price * count;
        })
    )

    // checking and validating if any coupon user have
    if (couponCode) {
        let coupon = await Coupon.findOne({ code: couponCode });

        if (!coupon) {
            throw new CustomError("No such coupon found", 404);
        }

        if (!coupon?.active || coupon.couponExpiresIn < Date.now()) {
            throw new CustomError("Coupon has Expired", 400)
        }

        discountAmount = totalAmount * (coupon.discount / 100);

        totalAmount = totalAmount - discountAmount;
    }

    const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };

    // creating razorpay  order id
    const order = await razorpay.orders.create(options);

    if (!order) {
        throw new CustomError("Transaction Failed", 400);
    }

    res.status(200).json({
        success: true,
        message: "Razorpay orderId successfully generated",
        order
    })

})


export const generateOrder = asyncHandler(async (req, res) => {
    const { products, coupon, address, phoneNumber, amount, transactionId } = req.body;

    let orderProducts = [];

    if (!products || products.length === 0) {
        throw new CustomError("No products found", 400);
    }

    const updateProductStock = Promise.all(
        products.map(async (product) => {
            const foundProduct = await Product.findById(product.productId);

            orderProducts.push({
                productId: product.productId,
                count: product.count,
                price: amount
            })

            // updating product stock count and soldout count in database

            foundProduct.stock -= count;
            foundProduct.sold += count;
            await foundProduct.save();
        })
    )

    await updateProductStock;

    const order = await Order.create({
        products: orderProducts,
        user: req.user._id,
        address,
        phoneNumber,
        coupon: coupon || 0,
        amount: amount,
        paymentId: transactionId
    })

    res.status(201).json({
        success: true,
        message: "Order successfully placed",
        order
    });
});


// sending the specific user all orders
export const getMyOrders = asyncHandler(async(req,res) => {
    const { userId } = req.user._id;

    const orders = await Order.find({ user: userId}).sort({createdAt: -1}).populate("products.productId");

    if(!orders) {
        throw new CustomError("Not found any order", 404);
    }

    res.status(200).json({
        success:true,
        orders
    })
})

// sending all the order details to the admin
export const getAllOrders = asyncHandler(async (req,res) => {

    const orders = await Order.find().sort({createdAt: -1}).populate("products.productId").populate("user","_id name email")

    if (!orders) {
        throw new CustomError("No orders found", 404);
    }

    res.status(200).json({
        success: true,
        orders,
    });

})


// update Order status

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus } = req.body;
    const { id: orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
        orderId,
        { status: orderStatus },
        { new: true }
    );

    if (!order) {
        throw new CustomError("Not found Any order", 400);
    }

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
    });
});
