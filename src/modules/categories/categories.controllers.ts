import { Request, Response } from "express";
import { CategoryService } from "./categories.services";

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

    if(Array.isArray(userEmail)){
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

    if(Array.isArray(userEmail)){
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const categories = await CategoryService.getIncomeCategories(userEmail);
    console.log(categories)
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

    if(Array.isArray(userEmail)){
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

export const CategoryController = {
  createCategory,
  getAllCategories,
  getIncomeCategories,
  getExpenseCategories,
};
