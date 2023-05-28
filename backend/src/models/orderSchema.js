import mongoose from 'mongoose';
import orderStatus from '../utils/orderStatus.js';

const orderSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product"
                    },
                    count: Number,
                    price: Number
                }
            ],
            required: [true, "Atleast one product should be buy"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "You have to provide user details"]
        },
        address: {
            type: String,
            required: [true, "You have to provide address"]
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(orderStatus),
            default: "ORDERED"
        },
        paymentId: String,
        coupon: String

    },
    { timestamps: true }
)

export default mongoose.model("Order", orderSchema);