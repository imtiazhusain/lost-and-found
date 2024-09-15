import express from 'express'
const router = express.Router()
import {login,createUser, sendOTP, verifyUser} from '../controllers/User.controller'
import upload from '../middlewares/multer'
router.post('/login',login)
router.post('/signup',upload.single('profilePic'),createUser)
router.post("/verify_user", verifyUser);
router.post("/send_otp",sendOTP);


export default router