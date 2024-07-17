import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import {Message} from '../modals/messageSchema.modals.js'


export const sendMessage = catchAsyncErrors(async(req, res, next) => {
   try {
    const {senderName, subject, message} = req.body
    if(!senderName || !subject || !message){
       return next(new ErrorHandler("Please fill full form", 400))
    }
    const data = await Message.create({senderName, subject, message})
    res.status(200).json({
        success : true,
        message: "Message sent",
        data,
    })
   } catch (error) {
    next(new ErrorHandler(error.message, 400))
   }
})

export const allMessages = catchAsyncErrors(async(req, res, next) => {
    try {
        const data = await Message.find();
        res.status(200).json({
            success: true,
            data 
        })
    } catch (error) {
     next(new ErrorHandler(error.message, 400))   
    }
})


export const deleteMessage = catchAsyncErrors(async(req, res, next) => {
    try {
        const {id} = req.params
        if(!id) {
           next(new ErrorHandler("Please provide message id"))
           return
        }
        const data = await Message.findByIdAndDelete(id)
        if(!data){
          return  res.status(404).json({
                success: false,
                message: "message not Found!",
            })
        }
        res.status(200).json({
            success: true,
            message: "Message delted!",
        })
    } catch (error) {
        next(new ErrorHandler(error.message, error.statusCode || 400))
    }
})