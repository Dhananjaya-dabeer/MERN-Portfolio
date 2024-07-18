import express from 'express'
import { getUser, login, logout, register, updateProfile } from '../controllers/user.controllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", verifyToken , logout)
router.get("/me", verifyToken , getUser)
router.put("/update/profile", verifyToken , updateProfile)


export default router