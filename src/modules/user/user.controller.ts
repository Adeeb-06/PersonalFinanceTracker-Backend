import { Request, Response } from "express";
import { createUser } from "./user.services";
import User from "./user.model";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json("user created successfully");
  } catch (error: any) {
    // console.log(error)
    res.status(400).json({ message: error.message });// Send the error message in the response
  }
};

export const userExists = async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  res.status(200).json(!!user);
}


export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.find()
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error , Get User" });
  }
}