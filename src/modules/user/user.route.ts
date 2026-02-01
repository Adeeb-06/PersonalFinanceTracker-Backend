import { Router } from "express";
import { registerUser , getUser, userExists } from "./user.controller";

const userRouter = Router()

userRouter.post('/register',  registerUser)
userRouter.get('/',  getUser)
userRouter.get('/:email/exists',  userExists)

export default userRouter;