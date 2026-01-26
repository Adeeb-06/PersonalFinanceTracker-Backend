import { Request, Response } from "express";
import { createUser } from "./user.services";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    // console.log(error)
    res.status(400).json({ error: error.message });
  }
};
