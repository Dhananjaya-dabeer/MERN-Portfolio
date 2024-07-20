import express from 'express'
import {
  addNewApplication,
  deleteApplication,
  getAllApplications,
} from '../controllers/softwareApplication.controllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/add', verifyToken, addNewApplication)
router.delete('/delete/:id', verifyToken, deleteApplication)
router.get('/getall', getAllApplications)

export default router
