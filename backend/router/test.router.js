import express from 'express'
import { testingFunction } from '../controllers/test.controller.js'

const router = express.Router()

router.get('/check', testingFunction)

export default router
