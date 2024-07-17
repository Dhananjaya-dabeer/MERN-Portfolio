import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import dbConnection from './database/dbConnection.js'
import { errorMiddleWare } from './middlewares/error.js'
import messageRouter from './router/message.router.js'
const app = express()
dotenv.config()

app.use(cors({
    origin:[process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods:["GET", "POST","DELETE", "PUT"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/"
}))

dbConnection()
app.use("/api/v1/message", messageRouter)




app.use(errorMiddleWare)

export default app