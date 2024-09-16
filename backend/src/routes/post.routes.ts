import express from 'express'
import { allPosts, createPost, userPosts } from '../controllers/Post.controller'
import auth from '../middlewares/auth'
import upload from '../middlewares/multer'
const router = express.Router()


router.post('/create',auth,upload.single('image'),createPost)
router.get('/all',allPosts)
router.get('/user-posts',auth,userPosts)

export default router