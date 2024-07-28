import { catchAsyncErrors } from './catchAsyncErrors.js'
import ErrorHandler from './error.js'
import jwt from 'jsonwebtoken'
import { User } from '../modals/userShema.modals.js'

export const verifyToken = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next(new ErrorHandler('User not Authenticated!', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ErrorHandler('Token expired. Please log in again.', 403))
    } else if (error.name === 'JsonWebTokenError') {
      return next(new ErrorHandler('Invalid token. Please log in again.', 403))
    } else {
      return next(
        new ErrorHandler('An error occurred during authentication.', 500)
      )
    }
  }
})
