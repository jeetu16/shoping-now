import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true,
            trim:true,
            maxLength: [120,"Product name should be less than 120 characters"]
        },
        description: {
            type: String
        },
        price : {
            type: Number,
            required: [true, "Please provide a price for the product"]
        },
        stock: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        photos: [
            {
                secure_url: {
                    type: String,
                    required: [true, "You have to provide atleast one Image"]
                }
            }
        ]
    },
    {timestamps:true}
)

export default mongoose.model("Product", productSchema);