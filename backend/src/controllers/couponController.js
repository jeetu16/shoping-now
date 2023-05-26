import Coupon from '../models/couponSchema.js';
import CustomError from '../service/CustomError.js';
import asyncHandler from '../service/asyncHandler.js';


// adding a coupon coupon
export const addCoupon = asyncHandler(async(req, res) => {

    const {coupon, discount, expriryDays} = req.body;

    if(!coupon || !discount || !expriryDays) {
        throw new CustomError("Please provide coupon and discount", 400);
    }

    const isCouponExists = await Coupon.findOne({code:coupon});

    if(isCouponExists) {
        throw new CustomError("Coupon is already exist please provide unique coupon", 409);
    }

    const newCoupon = await Coupon.create({
        code:coupon,
        discount:discount,
        couponExpiresIn: Date.now() + expriryDays * 24 * 60 * 60 * 1000
    }) 

    res.status(201).json({
        success: true,
        newCoupon
    })

})


// getting all the coupons
export const getAllCoupon = asyncHandler(async(req,res) => {
    
    const coupons = await Coupon.find();

    if(!coupons) {
        throw new CustomError("No coupon available",204);
    }

    res.status(200).json({
        success:true,
        coupons
    })

})


// deleting a coupon
export const deleteCoupon = asyncHandler(async(req,res) => {
    const {coupon: code} = req.body

    if(!code) {
        throw new CustomError("please provide a coupon code to be deleted")
    }

    const deletedCoupon = await Coupon.findOneAndDelete({code:code});

    if(!deletedCoupon) {
        throw new CustomError("No coupon found", 404);
    }

    res.status(200).json({
        success:true,
        message: "Coupon successfully deleted"
    })
})


// updating a particular coupon
export const updateCoupon = asyncHandler(async(req,res) => {
    const {coupon, action} = req.body;

    if(!coupon || action === undefined) {
        throw new CustomError("Please provide coupon to be update")
    }

    const updatedCoupon = await Coupon.findOneAndUpdate(
        { code: coupon},
        { status: action },
        { runValidators:true }
    )

    if(!updateCoupon) {
        throw new CustomError("No coupon found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Coupon successfully updated"
    })
})


// getting coupon coupon details
export const getCoupon = asyncHandler(async(req,res) => {
    const {code} = req.body;

    if(!code) {
        throw new CustomError("Please provide coupon code to be update",400)
    }

    const coupon = await Coupon.findOne({code:code});

    if(!coupon) {
        throw new CustomError("Not found any coupon",404);
    }

    res.status(200).json({
        success: true,
        coupon
    })
})