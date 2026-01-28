import { Router } from "express";
import { registerUser , getUser } from "./user.controller";

const userRouter = Router()

userRouter.post('/register',  registerUser)
userRouter.get('/',  getUser)

export default userRouter;