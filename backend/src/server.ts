import express from 'express'
import morgan from 'morgan'
import connectDB from './config/db'
import globalErrorHandler from './middlewares/errors/errorHandler'
import userRoutes from './routes/user.routes'
import postRoutes from './routes/post.routes'
import {PORT} from './config/envConfig'
import cors from 'cors'
import path from 'path'
const app = express()


app.use(express.json())
app.use(morgan('tiny'))
app.disable('x-powered-by')
app.use(cors())
connectDB()

// this line is for deployment purpose it will give us root directory
const rootDirectory = path.resolve()
// this line is for deployment
app.use(express.static(rootDirectory + "/frontend/dist"));


// Routes
app.use('/api/user',userRoutes)
app.use('/api/post',postRoutes)

// all routes that does not match then this will be called but commented for deployment purpose because of we send index.html file if no path matched
app.use("/api*", (req, res) => {
  res.status(404).json({ status: "ERROR", message: "Invalid api endpoint" });
});
 // Global error handler
 app.use(globalErrorHandler);


 // this line is for deployment
app.get("*", (req, res) => {
  res.sendFile(path.join(rootDirectory, "frontend", "dist", "index.html"));
});

app.listen(PORT,()=>{
console.log(`app is listening at http://localhost:${PORT}`)
})