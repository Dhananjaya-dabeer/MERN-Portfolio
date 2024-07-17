import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/error.js'
import {User} from "../modals/userShema.modals.js"
import {v2 as cloudinary} from "cloudinary"

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
      res.status(200).json({
        success: true,
        message: "User Created Successfully"
      })
  } catch (error) {
    next(new ErrorHandler(error.message, error.statusCode || 400))
  }
})