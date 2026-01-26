import { Router } from "express";
import { registerUser } from "./user.controller";

const userRouter = Router()

userRouter.post('/register',  registerUser)

export default userRouter;