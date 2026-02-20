import { Router } from "express";
import {
  registerUser,
  upsertUser,
  getUser,
  userExists,
  getUserByEmail,
} from "./user.controller";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/upsert", upsertUser);
userRouter.get("/", getUser);
userRouter.get("/:email/exists", userExists);
userRouter.get("/:email", getUserByEmail);

export default userRouter;
