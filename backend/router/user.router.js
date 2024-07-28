import express from 'express'
import {
  forgotPassword,
  getUser,
  getUserforPortfolio,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
} from '../controllers/user.controllers.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', verifyToken, logout)
router.get('/me', verifyToken, getUser)
router.put('/update/me', verifyToken, updateProfile)
router.put('/update/password', verifyToken, updatePassword)
router.get('/me/portfolio', getUserforPortfolio)
router.post('/password/forgot', forgotPassword)
router.put('/password/reset/:token', resetPassword)

export default router
