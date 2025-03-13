import express from 'express'
import { userLogin, userRegister } from '../controllers/authController'
import { errorHandler } from '../../errorHandler'

const authRouter = express.Router()

authRouter.post('/login', errorHandler(userLogin))
authRouter.post('/register', errorHandler(userRegister))

export default authRouter;