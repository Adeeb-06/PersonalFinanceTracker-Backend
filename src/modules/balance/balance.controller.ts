import { Request, Response } from "express";
import BalanceModel from "./balance.model";
import { BalanceDTO } from "./balance.types";
import User from "../user/user.model";
import CategoryModel from "../categories/categories.model";

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

    await CategoryModel.findOneAndUpdate(
      { name: category, userEmail },
      {
        $push: {
          transactions: newBalance._id,
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

    const query: any = { userEmail, type: "income" };

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

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const income = await BalanceModel.findById(id);
    const category = await CategoryModel.findOne({
      name: income?.category,
      userEmail: income?.userEmail,
    });
    await BalanceModel.findByIdAndDelete(id);
    await CategoryModel.updateOne(
      { _id: category?._id },
      { $pull: { transactions: id } },
    );
    await User.updateOne(
      { email: income?.userEmail },
      { $inc: { balance: -income?.amount } },
    );
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id, "id");
    const income = await BalanceModel.findById(id);
    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }
    console.log(income, "income");
    console.log(id, "id");
    res.status(200).json(income);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date, time } = req.body;
    const income = await BalanceModel.findById(id);
    const categoryData = await CategoryModel.find({
      name: income?.category,
      userEmail: income?.userEmail,
    });
    await BalanceModel.findByIdAndUpdate(id, {
      amount,
      category,
      description,
      date,
      time,
    });

    await CategoryModel.updateOne(
      { name: category, userEmail: income?.userEmail, type: "income" },
      {
        $push: {
          transactions: id,
        },
      },
    );

    if (income?.amount !== amount) {
      if (income?.amount < amount) {
        await User.updateOne(
          { email: income?.userEmail },
          { $inc: { balance: amount - income?.amount } },
        );
      } else {
        await User.updateOne(
          { email: income?.userEmail },
          { $inc: { balance: -(income?.amount - amount) } },
        );
      }
    }
    res.status(200).json({ message: "Income updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
