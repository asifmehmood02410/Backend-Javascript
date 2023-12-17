import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { application } from 'express';


const registerUser = asyncHandler(async (req, res) => {

    // res.status(200).json({
    //     message: "Ok"
    // })

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for image , check for avatar
    // upload them to cloudinary, avatar
    // create user object - creat entry in db
    // remove password and refresh token field from response
    // chehc for user creation
    // return response

    const { fullname, email, username, password } = req.body
    console.log("Email:", email)

    //validation of fields empty not acceptable

    console.log("I am consoling req.body in user controller for study purpose", req.body);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }

    // check if user already exists: username, email

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    // check for image , check for avatar

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage)) {

        coverImageLocalPath = req.files.coverImage[0].path;

    }


    // console.log("I am consoling req.files in user controller for study purpose", req.files);

    // validatation for avatar
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar field is required")
    }

    // upload them to cloudinary, coverimage and avatar

    console.log("My local path of COver image", coverImageLocalPath)
    console.log("My local path of COver image req.files.coverImage", req.files.coverImage)

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // validatation for avatar
    if (!avatar) {
        throw new ApiError(400, "Avatar field is required")
    }

    // create user object - creat entry in db

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username
    })

    //Check if Field added into the mongo DB. when ever field add into the Monogo Db first time it auto create _id field in the created table which is uniqu.

    // .select method use to remove or unselect fields from the user object. -password and -refreshTokens field will not select all other will selected and ready to insert field in the Database

    // remove password and refresh token field from response

    const createUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )

    // chehc for user creation


    if (!createUser) {
        throw new ApiError(500, "Some thing went wrong while registering a user")
    }

    // return response

    return res.status(201).json(
        new ApiResponse(200, createUser, "User Registered Successfully")
    )



});

const generateAccessAndRefreshTokens = async (userId) => {
    try {

        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // we will save refresh token in our database for user authentication

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return (accessToken, refreshToken);

    } catch (error) {

        throw new ApiError(500, "Somethin went wrong while generating refresh and access token")

    }
}

const loginUser = asyncHandler(async (req, res) => {

    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const { email, username, password } = req.body

    if (!(username || email)) {
        throw new ApiError(400, "username and password is required")
    }
    //findone return first data which found
    const userData = await User.findOne({

        $or: [{ username }, { email }]

    })

    if (!userData) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await userData.isPasswordCorrect(password);

    if (!userData) {
        throw new ApiError(401, "Invalid User Credientials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userData._id);

    //in this query we selecting all fields from database except password and refreshtoken
    const loggedInUser = await userData.findById(userda._id).select("-password -refreshToken")

    //sending data in cookies
    // some setting of cookies

    const options = {
        httpOnly: true, //if we set both true, our cookies will be modified by only server can't modify from front end, we can see it only.
        secure: true
    }

    return res
        .status(200)
        .cookie("accessTokenCookie", accessToken, options)
        .cookie("refreshTokenCookie", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in Successfully"
            )
        )



});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, //i am getting req.user._id from the auth.middleware.js please read it
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            // this is used to return refresh value after updation.
            new: true
        }

    )

    const options = {
        httpOnly: true, //if we set both true, our cookies will be modified by only server can't modify from front end, we can see it only.
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessTokenCookie", options)
        .clearCookie("refreshTokenCookie", options)
        .json(
            new ApiResponse(200, {}, "User Logged Out")
        )


});

export {
    registerUser,
    loginUser,
    logoutUser
}
