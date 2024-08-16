import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/error.js'

export const testingFunction = catchAsyncErrors(async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Server is Up and running',
    })
  } catch (error) {
    next(new ErrorHandler(error.message, 400))
  }
})
