import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/error.js'
import {User} from "../modals/userShema.modals.js"
import {v2 as cloudinary} from "cloudinary"
import { genrateToken } from '../utils/jwtToken.js'

export const register = catchAsyncErrors(async(req, res, next) => {
  try {
      if(!req.files || Object.keys(req.files).length === 0){
          return next(new ErrorHandler("Both Avatar and Resume are required!", 400))
      }
  
      const {avatar, resume} = req.files;
  
      const cloudinaryResponseForavatar = await cloudinary.uploader.upload(
          avatar.tempFilePath,
          {folder: "AVATAR"}
      )
      if(!cloudinaryResponseForavatar || cloudinaryResponseForavatar.error){
          console.error("Cloudinary Error:", cloudinaryResponseForavatar.error || "Unknown Cloudinary Error!")
      }
      const cloudinaryResponseForResume = await cloudinary.uploader.upload(
          resume.tempFilePath,
          {folder: "MY_RESUME"}
      )
      if(!cloudinaryResponseForResume || cloudinaryResponseForResume.error){
          console.error("Cloudinary Error:", cloudinaryResponseForResume.error || "Unknown Cloudinary Error!")
      }
  
      const {
      fullName,
      email,
      phone,
      aboutMe,
      password,    
      portfolioURL,
      githubURL,
      linkedinURL,
      instagramURL,
      facebookURL,
      twitterURL,
      resetPasswordToken,
      resetPaswordExpire} = req.body
  
      const user = await User.create({
          fullName,
          email,
          phone,
          aboutMe,
          password,    
          portfolioURL,
          githubURL,
          linkedinURL,
          instagramURL,
          facebookURL,
          twitterURL,
          resetPasswordToken,
          resetPaswordExpire,
          avatar:{
              public_id: cloudinaryResponseForavatar.public_id,
              url: cloudinaryResponseForavatar.secure_url
          },
          resume:{
              public_id: cloudinaryResponseForResume.public_id,
              url: cloudinaryResponseForResume.secure_url
          }
      })
     genrateToken(user, "Registered Successfully", 200, res)
  } catch (error) {
    next(new ErrorHandler(error.message, error.statusCode || 400))
  }
})

 export const login = catchAsyncErrors(async (req, res, next) => {
        const {email, password} = req.body

        if(!email || !password){
          return  next(new ErrorHandler("Both email and password are required", 400))
        }

        const user = await User.findOne({email}).select("+password")
        if(!user){
            return next(new ErrorHandler("user not found", 404))
        }

        const isPasswordMatched = user.comparePassword(password)
        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid email or password"))
        }

        genrateToken(user, "loggedin successfully!", 200, res)
})

export const logout = catchAsyncErrors(async(req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "Logged out successfully!"
    })
})


export const getUser = catchAsyncErrors(async(req, res, next ) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

export const updateProfile = catchAsyncErrors(async(req, res, next) => {
    const newUserData =  {
        fullName : req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        password: req.body.password,    
        portfolioURL: req.body.portfolioURL,
        githubURL: req.body.githubURL,
        linkedinURL: req.body.linkedinURL,
        instagramURL: req.body.instagramURL,
        facebookURL: req.body.facebookURL,
        twitterURL: req.body.twitterURL,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPaswordExpire: req.body.resetPaswordExpire
    }
    if(req.files && req.files.avatar){
        const avatar = req.files.avatar
        const user = await User.findById(req.user.id)
        const profileImageId = user.avatar.public_id
        await cloudinary.uploader.destroy(profileImageId)
        const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {folder: "AVATAR"}
        )
        newUserData.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }
    if(req.files && req.files.resume){
        const resume = req.files.resume
        const user = await User.findById(req.user.id)
        const resumeImageId = user.resume.public_id
        await cloudinary.uploader.destroy(resumeImageId)
        const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            {folder: "MY_RESUME"}
        )
        newUserData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        messsage: "Profile Updated!",
        user
    })
})