import { Request, Response } from "express";
import User from "./user.model";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, firebaseUid } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      firebaseUid: firebaseUid || "",
      password: "",
      balance: 0,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Upsert: create if not exists, return existing user if already there (for Google sign-in)
export const upsertUser = async (req: Request, res: Response) => {
  try {
    const { username, email, firebaseUid } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: username || email.split("@")[0],
        email,
        firebaseUid: firebaseUid || "",
        password: "",
        balance: 0,
      });
    } else if (firebaseUid && !user.firebaseUid) {
      // Link firebase UID if missing
      user.firebaseUid = firebaseUid;
      await user.save();
    }

    res.status(200).json({ message: "User upserted", user });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const userExists = async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ exists: false });
  }
  res.status(200).json({ exists: true });
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error, Get User" });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ exists: false });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error, Get User By Email" });
  }
};
