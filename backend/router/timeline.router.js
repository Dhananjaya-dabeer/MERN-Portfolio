import express from 'express'
import {
  postTimeline,
  deleteTimeline,
  getAllTimeLines,
} from '../controllers/timeline.controllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/add', verifyToken, postTimeline)
router.delete('/delete/:id', verifyToken, deleteTimeline)
router.get('/getall', getAllTimeLines)

export default router
