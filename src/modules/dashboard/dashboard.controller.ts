import { Request, Response } from "express";
import DashboardService from "./dashboard.services";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const { email } = req.params as { email: string };
    const { month, year } = req.query;

    const balance = await DashboardService.getBalance(email);
    const totalIncome = await DashboardService.getTotalIncomeByMonth(
      email,
      Number(month),
      Number(year),
    );
    const totalExpense = await DashboardService.getTotalExpenseByMonth(
      email,
      Number(month),
      Number(year),
    );
    const totalTransaction = await DashboardService.getTotalTransactionByMonth(
      email,
      Number(month),
      Number(year),
    );
    const topExpenseCategory = await DashboardService.getTopExpenseCategory(
      email,
      Number(month),
      Number(year),
    );
    return res
      .status(200)
      .json({
        balance,
        totalIncome,
        totalExpense,
        totalTransaction,
        topExpenseCategory,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
