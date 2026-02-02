import { Router } from "express";
import { registerUser , getUser, userExists, getUserByEmail } from "./user.controller";

const userRouter = Router()

userRouter.post('/register',  registerUser)
userRouter.get('/',  getUser)
userRouter.get('/:email/exists',  userExists)
userRouter.get('/:email',  getUserByEmail)

export default userRouter;