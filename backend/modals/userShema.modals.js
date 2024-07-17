import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [true, "Name required!"]
    },
    email:{
        type: String,
        required: [true, "Email required!"]
    },
    phone:{
        type: String,
        required: [true, "Phone number required!"]
    },
    aboutMe:{
        type: String,
        required: [true, "About me field is equired!"]
    },
    password:{
        type: String,
        required: [true, "Password is Required!"],
        minLength: [8, "Password must contain atleast 8 charecters!"],
        select: false
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    resume:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    portfolioURL:{
        type: String,
        required: true
    },
    githubURL:{
        type : String,
        required: true
    },
    linkedinURL:{
        type: String,
        required: true
    },
    instagramURL: String,
    facebookURL: String,
    twitterURL: String,

    resetPasswordToken: String,
    resetPaswordExpire: Date
})


export const User = mongoose.model("User", userSchema)