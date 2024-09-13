import express from 'express'
import morgan from 'morgan'
import connectDB from './config/db'
import globalErrorHandler from './middlewares/errors/errorHandler'
const app = express()


app.use(express.json())
app.use(morgan('tiny'))
app.disable('x-powered-by')
connectDB()



 // Global error handler
 app.use(globalErrorHandler);

const PORT = 3000
app.listen(PORT,()=>{
console.log(`app is listening at http://localhost:${PORT}`)
})