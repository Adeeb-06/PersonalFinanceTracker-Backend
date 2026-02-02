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

export const getIncomeData = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;
    const pages = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (pages - 1) * limit;
    console.log("User Email:", userEmail);

    const { from, to } = req.query;

    const query: any = { userEmail , type: "income" };

    if (from) {
      const startDate = new Date(from as string);
      startDate.setHours(0, 0, 0, 0);

      query.date = { ...query.date, $gte: startDate };
    }

    if (to) {
      const endDate = new Date(to as string);
      endDate.setHours(23, 59, 59, 999);

      query.date = { ...query.date, $lte: endDate };
    }

    const [balanceData, total] = await Promise.all([
      BalanceModel.find(query)
        .select("-type")
        .sort({ date: 1, time: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BalanceModel.countDocuments({ userEmail }),
    ]);

    console.log(balanceData, "balance");

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: balanceData,
      pagination: {
        currentPage: pages,
        totalPages,
        pageSize: limit,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
