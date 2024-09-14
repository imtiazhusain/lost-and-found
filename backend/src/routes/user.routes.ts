import express from 'express'
const router = express.Router()
import {login,createUser} from '../controllers/User.controller'
router.post('/login',login)



export default router