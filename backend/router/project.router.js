import express from 'express'
import {
  addNewProject,
  deleteProject,
  updateProject,
  getAllProject,
  getSingleProject,
} from '../controllers/project.controllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/add', verifyToken, addNewProject)
router.delete('/delete/:id', verifyToken, deleteProject)
router.put('/update/:id', verifyToken, updateProject)
router.get('/getall', getAllProject)
router.get('/get/:id', getSingleProject)

export default router
