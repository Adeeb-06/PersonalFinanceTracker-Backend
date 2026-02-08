import { Request, Response } from "express";
import BudgetModel from "./budget.model";

export const addBudget = async (req: Request, res: Response) => {
    try {
        const { userEmail, month, amount } = req.body;

        if (!userEmail || !month || !amount) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const monthName = (month: string) => {
            const date = new Date(month);
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
        };

        const newBudget = new BudgetModel({
            userEmail,
            month: monthName(month),
            amount,
        });

    
        const savedBudget = await newBudget.save();
        res.status(201).json(savedBudget);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding budget" });
    }
};


export const getBudget = async (req: Request, res: Response) => {
    const { userEmail } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = (page - 1) * limit;

    try {
        const [budgetData, total] = await Promise.all([
            BudgetModel.find({ userEmail })
                .select("-userEmail")
                .sort({ date: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            BudgetModel.countDocuments({ userEmail }),
        ]);

       

        res.status(200).json({
            data: budgetData,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                pageSize: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error getting budget data" });
    }
};  


export const getBudgetByMonth = async (req: Request, res: Response) => {
    const { userEmail } = req.params;
    const { month } = req.query;

    try {
        const budgetData = await BudgetModel.findOne({ userEmail, month });
        res.status(200).json(budgetData);
    } catch (error) {
        res.status(500).json({ message: "Error getting budget data" });
    }
};