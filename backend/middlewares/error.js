class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

export const errorMiddleWare = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error"
    err.statusCode = err.statusCode || 500

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new Error(ErrorHandler(message, 400))
    }
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token  is invalid. Try again!`
        err = new Error(ErrorHandler(message, 400))
    }
    if(err.name === "TokenExpiredError"){
        const message = `Json web token  is expired! Try to login.`
        err = new Error(ErrorHandler(message, 400))
    }
    if(err.name === "CastError"){
        const message = `Invalid ${err.path}`
        err = new Error(ErrorHandler(message, 400))
    }

    const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message
    res.status(err.statusCode).json({
        success: false,
        message: errorMessage 
    })
}

export default ErrorHandler