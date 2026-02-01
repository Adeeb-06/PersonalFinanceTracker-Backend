import { Request, Response } from "express";
import BalanceModel from "./balance.model";
import { BalanceDTO } from "./balance.types";
import User from "../user/user.model";

export const addBalance = async (req: Request, res: Response) => {
  try {
    const {
      userEmail,
      date,
      time,
      amount,
      type,
      category,
      description,
    }: BalanceDTO = req.body;

    if (!userEmail || !date || !time || !amount || !category) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const newBalance = new BalanceModel({
      userEmail,
      date,
      time,
      amount,
      type: "income",
      category,
      description,
    });

    await User.findOneAndUpdate(
      { email: userEmail },
      {
        $inc: {
          balance: amount,
        },
      },
    );

    const savedBalance = await newBalance.save();
    res.status(201).json(savedBalance);
  } catch (err: any) {
    if (err.response) {
      // This contains the JSON sent by the backend
      console.error("Error message from backend:", err.response.data.error);
    } else {
      console.error("Network or other error:", err.message);
    }
  }
};
