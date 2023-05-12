import User from '../models/userSchema.js';
import asyncHandler from '../service/asyncHandler.js'
import CustomError from '../service/CustomError.js';


export const signUp = asyncHandler(async(req,res) => {

    // taking user data for sign up
    const { name, email, password } = req.body;

    // checking minimum required data is given or not
    if(!name || !email || !password) {
        throw CustomError("Please provide all required fields", 400);
    }

    // checking user is exist or not
    const existingUser = await User.findOne({email})

    if(existingUser) {
        throw CustomError("User already exists", 409);
    }

    // saving users details in database
    const user = await User.create({
        name,
        email,
        password
    })

    // generating jwt token for user

    const token = user.user.generateJWTtoken();

})