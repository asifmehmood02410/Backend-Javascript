import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

// This middleware is used to authonticate the user, i will use it when i will logout the user first i will call this middleware in routes to authonticate the user by decoding the accessToken and then logout the user.
// i create this middleware for the reusablity were ever i need to logout user to like update the blogs, article any thing i need to access the User table in the database this method is giving me access to the database authontic user.


// if we are not using res in my code like below code we can replace res with "_" 
export const verifyJWT = asyncHandler(async (req, _, next) => {

    try {
        // i am getting accessToken
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {


            throw new ApiError(401, "Invalid Access Token")
        }

        // by putting user into req.user i can access this our database User table in the res where ever i will use asynHandler utils. e.g i am using it in the logoutUser function User.controller.js
        req.user = user;

        //this next is basically used to perform next taskt to call next method after finishing this method.
        next()


    } catch (error) {

        throw new ApiError(401, error?.message || "Invalid Access Token")

    }

});