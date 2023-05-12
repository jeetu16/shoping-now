import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Provide a coupon code"]
        },
        discount: {
            type: Number,
            default: 0
        },
        couponExpiresIn: {
            type: Date
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)


export default mongoose.model('Coupon', couponSchema);

