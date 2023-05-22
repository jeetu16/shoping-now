import User from '../models/userSchema.js';
import asyncHandler from '../service/asyncHandler.js'
import CustomError from '../service/CustomError.js';
import sendMailToUser from '../service/sendMailService.js';
import crypto from 'crypto';


// defined cookie options object for user cookie
export const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true
}

export const signUp = asyncHandler(async(req,res) => {

    // taking user data for sign up
    const { name, email, password } = req.body;

    // checking minimum required data is given or not
    if(!name || !email || !password) {
        throw new CustomError("Please provide all required fields", 400);
    }

    // checking user is exist or not
    const existingUser = await User.findOne({email})

    if(existingUser) {
        throw new CustomError("User already exists", 409);
    }

    // saving users details in database
    const user = await User.create({
        name,
        email,
        password
    })

    
    
    // generating jwt token for user
    const token = await user.generateJWTtoken();

    // for safety issue
    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    // sending response to user 
    res.status(201).json({
        success: true,
        message: "User successfully registered",
        user
    });
})


export const login = asyncHandler(async(req,res) => {
    
    // getting user email and password for login
    const { email, password } = req.body;

    // checking user email and password are proper received or not
    if(!email || !password) {
        throw new CustomError('Please provide email and password', 400)
    }

    // checking user already exists or not
    const user = await User.findOne({email}).select("+password");

    if(!user) {
        throw new CustomError("Not found any user with provided email", 404)
    }

    // checking user entered password in correct or not
    const result = await user.comparePassword(password)
    if(result) {
        const token = user.generateJWTtoken();
        res.cookie('token',token,cookieOptions)
        // for password safety
        user.password = undefined;
        return res.status(200).json({
            success: true,
            "message": "successfull logged in",
            token
        })
    }

    throw new CustomError("Unauthorised Access", 401);
})


export const logout = asyncHandler(async(req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Successfully logged out"
    });
});


export const forgotPassword = asyncHandler(async(req,res) => {
    const { email } = req.body;

    if(!email) {
        throw new CustomError("Please provide email",400);
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new CustomError("Not found user",404);
    }

    const resetToken = user.generateForgotPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/password/reset/${resetToken}`;

    const message = `Your password reset link is as follows  \n\n ${resetUrl} \n\n If this was not requested by you, please ignore this..`;
    try {
        await sendMailToUser({
          email: user.email,
          subject: "Password reset mail",
          message  
        })
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        user.save({validateBeforeSave: false});

        throw new CustomError(error.message || "Email could not be sent", 500)
    }

})



export const resetPassword = asyncHandler(async(req,res) => {
    const {password, confirmPassword} = req.body;
    const {token: resetToken} = req.params;

    if(!token ||!password || !confirmPassword) {
        throw new CustomError("Please provide password", 400);
    }

    if(password!==confirmPassword) {
        throw new CustomError("Your password is incorrect",406);
    }

    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
        forgotPasswordToken:resetPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now() }
    });

    if(!user) {
        throw new CustomError("Invalid token",406);
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    const token  = user.generateJWTtoken();
    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
        success:true,
        user
    })

})



