import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true //if you use any field most searchable in database then set index true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true
        },
        avatar: {
            type: String, //Cludinary url
            required: true
        },
        coverImage: {
            type: String //Cludinary url
        },
        watchHistory: [{
            //passing foreign key
            type: Schema.Types.ObjectId,
            ref: "Video"
        }],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshTokens: {
            type: String
        }


    },
    { timestamps: true }
);

//pre is hook of mongoose. We use pre if we perform any operation on data before any operation like save, update, delete etc... we should not use arrow function in pre hook.

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)

    next()


    // OR

    // if (this.isModified("password")) {
    //     this.password = bcrypt.hash(this.password, 10)
    // }else{
    //     next()
    // }


})


//In mongoose we can also create our methods. Now i am creating method to compare user input password and encrypted password is same. name of my created method is "isPasswordCorrect"

userSchema.methods.isPasswordCorrect = async function (password) {
    // bcrypt.compare method return result in Boolean. password is user input and this.password is encrypted password
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return Jwt.sign(
        {

            //_id, email, username, fullname are my generated name for the jwt payload, this._id, this.email etc are my database fields

            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign(
        {

            _id: this._id

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);