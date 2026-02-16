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


    const surplus = totalIncome - totalExpense;
    const surplusPercentage =  totalExpense === 0 ? 100 : (surplus / totalExpense) * 100;

    const budgetStatus = await DashboardService.checkBudgetStatus({email,month:Number(month),year:Number(year)});

    const incomeExpenseChart = await DashboardService.incomeExpenseChart({email})

    const savings = await DashboardService.savings({email,month:Number(month),year:Number(year)})

    return res
      .status(200)
      .json({
        balance,
        totalIncome,
        totalExpense,
        totalTransaction,
        topExpenseCategory,
        surplusPercentage,
        budgetStatus,
        incomeExpenseChart,
        savings
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
