import express from 'express'
import morgan from 'morgan'
import connectDB from './config/db'
import globalErrorHandler from './middlewares/errors/errorHandler'
import userRoutes from './routes/user.routes'
import {PORT} from './config/envConfig'
const app = express()


app.use(express.json())
app.use(morgan('tiny'))
app.disable('x-powered-by')
connectDB()



// Routes
app.use('/api/user',userRoutes)

 // Global error handler
 app.use(globalErrorHandler);

app.listen(PORT,()=>{
console.log(`app is listening at http://localhost:${PORT}`)
})