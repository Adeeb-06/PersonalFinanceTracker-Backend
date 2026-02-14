import { Request, Response } from "express";
import ExpenseModel from "./expense.model";
import User from "../user/user.model";
import BudgetModel from "../budget/budget.model";
import CategoryModel from "../categories/categories.model";
import { ObjectId } from "mongodb";

interface ExpenseReq extends Request {
  body: {
    userEmail: string;
    amount: number;
    date: Date;
    time: string;
    category: string;
    description: string;
  };
}

export const addExpense = async (req: ExpenseReq, res: Response) => {
  const { userEmail, amount, date, time, category, description } = req.body;

  if (!userEmail || !amount || !date || !category || !description) {
    return res.status(400).json({ message: "Required fields are missing" });
  }
  const dateObj = new Date(date);

  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const dateString = `${month}/${year}`;

  try {
    const expense = await ExpenseModel.create({
      userEmail,
      amount,
      date,
      time,
      category,
      description,
    });
    const user = await User.findOne({ email: userEmail });

    const budgetDeduction = await BudgetModel.findOne({
      userEmail,
      month: dateString,
    });

    if (budgetDeduction) {
      await BudgetModel.findOneAndUpdate(
        { userEmail, month: dateString },
        {
          $inc: {
            spent: amount,
          },
          $set: {
            remaining: budgetDeduction.amount - amount,
          },
        },
      );
    }

    if(budgetDeduction){
      if(budgetDeduction.remaining < 0){
        budgetDeduction.remaining = 0
        await budgetDeduction.save()
      }
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await User.findOneAndUpdate(
      { email: userEmail },
      {
        $inc: {
          balance: -amount,
        },
      },
    );

    await CategoryModel.findOneAndUpdate(
      { name: category, userEmail },
      {
        $push: {
          transactions: expense._id,
        },
      },
    );

    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding expense" });
  }
};

export const getExpense = async (req: Request, res: Response) => {
  const { userEmail } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [expenseData, total] = await Promise.all([
      ExpenseModel.find({ userEmail })
        .select("-userEmail")
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ExpenseModel.countDocuments({ userEmail }),
    ]);

    res.status(200).json({
      data: expenseData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting expense data" });
  }
};

export const getTotalExpenseByMonth = async (req: Request, res: Response) => {
  const { userEmail } = req.params;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: "month and year are required" });
  }

  const monthNum = Number(month);
  const yearNum = Number(year);

  const startDate = new Date(yearNum, monthNum - 1, 1);
  const endDate = new Date(yearNum, monthNum, 0);

  try {
    const result = await ExpenseModel.aggregate([
      {
        $match: {
          userEmail,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalExpense = result[0].total;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    res.status(200).json({
      total: totalExpense,
      monthNames: monthNames[monthNum - 1],
      monthNumber: monthNum,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting expense data" });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const expense = await ExpenseModel.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error getting expense data" });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, date, time, category, description } = req.body;
  try {
    const expense = await ExpenseModel.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.amount = amount;
    expense.date = date;
    expense.time = time;
    expense.category = category;
    expense.description = description;

    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const dateString = `${month}/${year}`;

    const budgetDeduction = await BudgetModel.findOne({
      userEmail: expense.userEmail,
      month: dateString,
    });

    await BudgetModel.findOneAndUpdate(
      { userEmail: expense.userEmail, month: dateString },
      {
        $inc: {
          spent: amount,
        },
        $set: {
          remaining: budgetDeduction.amount - amount,
        },
      },
    );

    await User.findOneAndUpdate(
      { email: expense.userEmail },
      {
        $inc: {
          balance: -amount,
        },
      },
    );


    await expense.save();
    res.status(201).json({ message: "Expense updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating expense" });
  }
};
