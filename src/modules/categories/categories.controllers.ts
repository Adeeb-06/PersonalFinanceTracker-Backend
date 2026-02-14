import { Request, Response } from "express";
import { CategoryService } from "./categories.services";
import CategoryModel from "./categories.model";
import ExpenseModel from "../expense/expense.model";
import { ICategory } from "./category.type";
import BalanceModel from "../balance/balance.model";

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type, userEmail } = req.body;
    const category = await CategoryService.createCategory({
      name,
      type,
      userEmail,
    });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;

    if (Array.isArray(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }
    const categories = await CategoryService.getAllCategories(userEmail);
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve categories",
    });
  }
};

const getIncomeCategories = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;

    if (Array.isArray(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const categories = await CategoryService.getIncomeCategories(userEmail);

    res.status(200).json({
      success: true,
      message: "Income categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve income categories",
    });
  }
};

const getExpenseCategories = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;

    if (Array.isArray(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const categories = await CategoryService.getExpenseCategories(userEmail);
    res.status(200).json({
      success: true,
      message: "Expense categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve expense categories",
    });
  }
};

const getCategoryAnalytics = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;
    const { category } = req.query;
    const { month, year } = req.query;

    if (Array.isArray(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    const lastMonthStartDate = new Date(Number(year), Number(month) - 2, 1);
    const lastMonthEndDate = new Date(Number(year), Number(month) - 1, 0);

    const categoryData = await CategoryModel.findOne<ICategory>({
      userEmail,
      name: { $regex: new RegExp(`^${category}$`, "i") },
    });

    const analytics = {
      totalAmount: 0,
      totalTransactions: 0,
      lastMonthAmount: 0,
      lastMonthTransactions: 0,
    };
    if (!categoryData) {
      throw new Error("Category not found");
    }

  

    for (const transaction of categoryData?.transactions) {
      let transactionData;

      if (categoryData.type === "expense") {
        transactionData = await ExpenseModel.findById(transaction);
        if (!transactionData) {
          transactionData = await BalanceModel.findById(transaction);
        }
      } else {
        transactionData = await BalanceModel.findById(transaction);
        if (!transactionData) {
          transactionData = await ExpenseModel.findById(transaction);
        }
      }

      if (
        transactionData &&
        transactionData.date >= startDate &&
        transactionData.date <= endDate
      ) {
        analytics.totalAmount += transactionData.amount;
        analytics.totalTransactions += 1;
      }
      if (
        transactionData &&
        transactionData.date >= lastMonthStartDate &&
        transactionData.date <= lastMonthEndDate
      ) {
        analytics.lastMonthAmount += transactionData.amount;
        analytics.lastMonthTransactions += 1;
      }
    }

    let otherCategoriesAmount = 0;
    let otherCategoriesTransactions = 0;

    const otherCategories = await CategoryModel.find({
      userEmail,
      type: categoryData.type,
      name: { $ne: category },
    });

    for (const otherCategory of otherCategories) {
      let transactionData;

      for (const transaction of otherCategory.transactions) {
        if (otherCategory.type === "expense") {
          transactionData = await ExpenseModel.findById(transaction);
          if (!transactionData) {
            transactionData = await BalanceModel.findById(transaction);
          }
        } else {
          transactionData = await BalanceModel.findById(transaction);
          if (!transactionData) {
            transactionData = await ExpenseModel.findById(transaction);
          }
        }

        if (
          transactionData &&
          transactionData.date >= startDate &&
          transactionData.date <= endDate
        ) {
          otherCategoriesAmount += transactionData.amount;
          otherCategoriesTransactions += 1;
        }
      }
    }

    const percentageChange =
      ((analytics.totalAmount - analytics.lastMonthAmount) /
        analytics.lastMonthAmount) *
      100;

    const averageAmount = analytics.totalAmount / analytics.totalTransactions;

    const percentageOfTotal =
      (analytics.totalAmount /
        (analytics.totalAmount + otherCategoriesAmount)) *
      100;

    const pieData = [
      {
        name: categoryData.name,
        value: analytics.totalAmount,
      },
      {
        name: "Others",
        value: otherCategoriesAmount,
      },
    ];

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
      success: true,
      message: "Category analytics retrieved successfully",
      data: {
        ...analytics,
        percentageChange,
        averageAmount,
        pieData,
        percentageOfTotal,
      },
      month: monthNames[Number(month) - 1],
      monthNumber: Number(month),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve category analytics",
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Category id is required",
      });
    }
    await CategoryService.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete category",
    });
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getIncomeCategories,
  getExpenseCategories,
  getCategoryAnalytics,
  deleteCategory,
};
