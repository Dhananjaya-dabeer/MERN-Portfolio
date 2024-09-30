import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import dbConnection from './database/dbConnection.js'
import { errorMiddleWare } from './middlewares/error.js'
import messageRouter from './router/message.router.js'
import userRouter from './router/user.router.js'
import timelineRouer from './router/timeline.router.js'
import applicationRouter from './router/softwareApplication.router.js'
import skillRouter from './router/skill.router.js'
import projectRouter from './router/project.router.js'
import testRouter from './router/test.router.js'
const app = express()
dotenv.config()

app.use(
  cors({
    origin: [
      process.env.PORTFOLIO_URL,
      process.env.DASHBOARD_URL,
      process.emv.UPTIME_TOGGLER,
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/',
  })
)

dbConnection()
app.use('/api/v1/test', testRouter)
app.use('/api/v1/message', messageRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/timeline', timelineRouer)
app.use('/api/v1/softwareapplication', applicationRouter)
app.use('/api/v1/skill', skillRouter)
app.use('/api/v1/project', projectRouter)

app.use(errorMiddleWare)

export default app
