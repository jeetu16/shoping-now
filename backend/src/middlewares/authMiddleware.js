import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import CustomError from '../service/CustomError.js';
import asyncHandler from '../service/asyncHandler.js';
import config from '../config/index.js';
import authRoles from '../utils/authRoles.js';


export const isLoggedIn = asyncHandler(async(req,res,next) => {
    let token;
    if (req.cookie.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) ) {
        token = req.cookie.token || req.headers.authorization.split(" ")[0]
    }

    if(!token) {
        throw new CustomError("Unauthorized to access", 401);
    }

    try {
        const decodedJWTPayload = jwt.verify(token, config.JWT_SECRET_KEY);
        req.user = await User.findOne(decodedJWTPayload._id, "name email roles");
        next();

    } catch (error) {
        throw new CustomError("Unauthorized to access", 401)
    }
})

export const authorize = (...allowedRoles) => asyncHandler(async(req,res,next) => {
    if(req?.roles) {
        throw new CustomError("Unauthorized to access", 401);
    }
    const result = req.user.roles.map(role => allowedRoles.includes(role)).find(val => val===true);

    if(!result) {
        throw new CustomError("Unauthorized to access", 401)
    }
    next();
})