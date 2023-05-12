import mongoose from 'mongoose';
import authRoles from '../utils/authRoles.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name must be required"],
            minLength: [2, "Minimum 2 characters should be in name"],
            maxLength: [20, "Maximum 20 characters should be in name"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email must be required"],
            unique: true,
            trim: true,
            minLenght: [5, "Minimum 5 characters should be in email"],
            maxLength: [15, "Maximum 15 characters should be in email"]
        },
        password: {
            type: String,
            required: [true, "Password must be required"],
            select: true,
            maxLength: [24, "Password must be less than 25 characters"],
            minLenght: [8, "Password must be greater than 7 characters"]
        },
        mobileNumber: {
            type: Number,
            required: [true, "Mobile number must be required"],
            max: [10, "Mobile number must be 10 digits"],
            min: [10, "Mobile number must be 10 digits"]
        },
        roles: {
            type: String,
            enum: Object.values(authRoles),
            default: authRoles.ADMIN
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date
    },
    { timestamps: true }
)

// encrypting password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods = {
    // comparing password with entered password
    comparePassword: async function (enteredPassword) {
        return await bcrypt(enteredPassword, this.password);
    },

    // generating jwt token for user
    generateJWTtoken: function () {
        jwt.sign(
            { _id: this._id, roles: this.roles },
            config.JWT_SECRET_KEY,
            { expiresIn: config.JWT_EXPIRY }
        )
    },

    // generating forgot password token
    generateForgotPasswordToken: function () {

        // generating random string for forgot password
        const forgotToken = crypto.randomBytes(24).toString('hex');

        // ecrypting the the string created by crypto for the forgot password token
        this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

        // setting the expiry time for forgot password token
        this.forgotPasswordExpiry = Date.now() + 30 * 60 * 1000

        return forgotToken

    }
}

export default mongoose.model("User", userSchema);