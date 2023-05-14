import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a collection name'],
            trim:true,
            maxLenght: [20, "You can't use more than 20 characters for category name"],
            minLength: [2, "Minimun 2 characters should be for category name"]
        },
        photo: [
            {
                secure_url: {
                    type: String,
                    // required: [true, "You have to upload a photo"]
                }
            }
        ]
    },
    {
        timestamps:true
    }
)

export default mongoose.model("Categorie", categoriesSchema);