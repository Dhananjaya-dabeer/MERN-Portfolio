import express from 'express'
import { allMessages, deleteMessage, sendMessage } from '../controllers/message.controllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post("/send", sendMessage)
router.get("/getall", allMessages)
router.delete("/delete/:id",verifyToken, deleteMessage)


export default router