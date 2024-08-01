import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/error.js'
import { User } from '../modals/userShema.modals.js'
import { v2 as cloudinary } from 'cloudinary'
import { genrateToken } from '../utils/jwtToken.js'
import { sendEmail } from '../utils/sendEmail.js'
import crypto from 'crypto'
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler('Both Avatar and Resume are required!', 400))
    }

    const { avatar, resume } = req.files

    const cloudinaryResponseForavatar = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: 'AVATAR' }
    )
    if (!cloudinaryResponseForavatar || cloudinaryResponseForavatar.error) {
      console.error(
        'Cloudinary Error:',
        cloudinaryResponseForavatar.error || 'Unknown Cloudinary Error!'
      )
    }
    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: 'MY_RESUME' }
    )
    if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
      console.error(
        'Cloudinary Error:',
        cloudinaryResponseForResume.error || 'Unknown Cloudinary Error!'
      )
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
      resetPaswordExpire,
    } = req.body

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
      avatar: {
        public_id: cloudinaryResponseForavatar.public_id,
        url: cloudinaryResponseForavatar.secure_url,
      },
      resume: {
        public_id: cloudinaryResponseForResume.public_id,
        url: cloudinaryResponseForResume.secure_url,
      },
    })
    genrateToken(user, 'Registered Successfully', 200, res)
  } catch (error) {
    next(new ErrorHandler(error.message, error.statusCode || 400))
  }
})

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Both email and password are required', 400))
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(new ErrorHandler('user not found', 404))
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 400))
  }

  genrateToken(user, 'loggedin successfully!', 200, res)
})

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'Logged out successfully!',
    })
})

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    user,
  })
})

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    fullName: req.body.fullName,
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
    resetPaswordExpire: req.body.resetPaswordExpire,
  }

  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar
    const user = await User.findById(req.user.id)
    const profileImageId = user.avatar.public_id
    await cloudinary.uploader.destroy(profileImageId)
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: 'AVATAR' }
    )
    newUserData.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    }
  }
  if (req.files && req.files.resume) {
    const resume = req.files.resume
    const user = await User.findById(req.user.id)
    const resumeImageId = user.resume.public_id
    await cloudinary.uploader.destroy(resumeImageId)
    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: 'MY_RESUME' }
    )
    newUserData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    }
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    messsage: 'Profile Updated!',
    data: user,
  })
})

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler('All fields are required!', 400))
  }
  if (newPassword.length < 8 || confirmNewPassword.length < 8) {
    return next(
      new ErrorHandler('Password must contain atleast 8 charecters!', 400)
    )
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New password and confirm new Password doesn't match",
        400
      )
    )
  }
  if (currentPassword === newPassword) {
    return next(
      new ErrorHandler(
        'New Password should be different from Current Password',
        400
      )
    )
  }
  const user = await User.findById(req.user.id).select('+password')
  if (!user) {
    return next(new ErrorHandler('User not found', 400))
  }
  const isPasswordMatched = await user.comparePassword(currentPassword)
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Incorrect current password', 400))
  }

  user.password = newPassword
  user.save()
  res.status(200).json({
    success: true,
    message: 'Password updated',
  })
})

export const getUserforPortfolio = catchAsyncErrors(async (req, res, next) => {
  const id = '669967f7f044fcef3223a172'
  const user = await User.findById(id)
  res.status(200).json({
    success: true,
    user,
  })
})

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) return next(new ErrorHandler('Email required!', 400))
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    next(new ErrorHandler('User not found!', 404))
  }
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })
  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`
  const message = `Your reset password token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested for it, please ignore it`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Personal portfolio dashboard password recovery',
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully!`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    return next(new ErrorHandler(err.message, 500))
  }
})

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params
  if (!token) {
    return next(new ErrorHandler('token not found!', 404))
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler('Password and confirm password does not match')
    )
  }
  if (req.body.password.length < 8 || req.body.confirmPassword.length < 8) {
    return next(
      new ErrorHandler('Password must contain atleast 8 charecters!', 400)
    )
  }
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(
      new ErrorHandler(
        'reset password token is invaild or has been expired',
        400
      )
    )
  }
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()
  genrateToken(user, 'Password reset successfully!', 200, res)
})
