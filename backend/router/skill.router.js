import express from 'express'
import {
  addNewSkill,
  deleteSkill,
  updateSkill,
  getAllSkills,
} from '../controllers/skill.controllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/add', verifyToken, addNewSkill)
router.delete('/delete/:id', verifyToken, deleteSkill)
router.put('/update/:id', verifyToken, updateSkill)
router.get('/getall', getAllSkills)

export default router
