import { Request, Response } from "express";
import ExpenseModel from "./expense.model";
import User from "../user/user.model";
import BudgetModel from "../budget/budget.model";

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

    if(!userEmail || !amount || !date || !category || !description) {
        return res.status(400).json({ message: "Required fields are missing" });
    }
    const dateObj = new Date(date);

    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()
    console.log(month , year , "month")

    const dateString = `${month}/${year}`

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

        const budgetDeduction  = await BudgetModel.findOne({ userEmail, month: dateString });
        if(budgetDeduction){
            await BudgetModel.findOneAndUpdate(
                { userEmail, month: dateString },
                {
                    $inc: {
                        spent: amount,
                        remaining: budgetDeduction.amount-amount,
                    },
                },
            );
        } 



        if(user.balance < amount){
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

        res.status(201).json({message: "Expense added successfully"});
    } catch (error) {
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
    const { month } = req.query;

    try {
        const expenseData = await ExpenseModel.findOne({ userEmail, month });
        const result = await ExpenseModel.aggregate([
            {
                $match: {
                    userEmail,
                    month,
                },
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                }
            }
        ])
    } catch (error) {
        res.status(500).json({ message: "Error getting expense data" });
    }
};