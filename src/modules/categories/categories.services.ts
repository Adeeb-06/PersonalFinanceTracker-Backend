import BalanceModel from "../balance/balance.model";
import ExpenseModel from "../expense/expense.model";
import CategoryModel from "./categories.model";

const createCategory = async (payload: {
  name: string;
  type: "income" | "expense";
  userEmail: string;
}) => {
  const category = await CategoryModel.create(payload);
  return category;
};

const getAllCategories = async (userEmail: string) => {
  const categories = await CategoryModel.find({ userEmail });
  return categories;
};

const getIncomeCategories = async (userEmail: string) => {
  const categories = await CategoryModel.find({ userEmail, type: "income" });

  return categories;
};

const getExpenseCategories = async (userEmail: string) => {
  const categories = await CategoryModel.find({ userEmail, type: "expense" });
  return categories;
};

const deleteCategory = async (id: string) => {
  const categoryData = await CategoryModel.findById(id);

  if (!categoryData) {
    throw new Error("Category not found");
  }

  const transactions = categoryData.transactions || [];

  let otherCategoryIncome = await CategoryModel.findOne({
    name: "Other",
    type: "income",
    userEmail: categoryData.userEmail,
  });

  let otherCategoryExpense = await CategoryModel.findOne({
    name: "Other",
    type: "expense",
    userEmail: categoryData.userEmail,
  });

  if (!otherCategoryIncome) {
    otherCategoryIncome = await CategoryModel.create({
      name: "Other",
      type: "income",
      userEmail: categoryData.userEmail,
      transactions: [],
    });
  }

  if (!otherCategoryExpense) {
    otherCategoryExpense = await CategoryModel.create({
      name: "Other",
      type: "expense",
      userEmail: categoryData.userEmail,
      transactions: [],
    });
  }

  await ExpenseModel.updateMany(
    { category: categoryData.name },
    { category: "Other" }
  );

  await BalanceModel.updateMany(
    { category: categoryData.name },
    { category: "Other" }
  );

  otherCategoryExpense.transactions.push(...transactions);
  await otherCategoryExpense.save();

  otherCategoryIncome.transactions.push(...transactions);
  await otherCategoryIncome.save();

  await CategoryModel.findByIdAndDelete(id);
};


export const CategoryService = {
  createCategory,
  getAllCategories,
  getIncomeCategories,
  getExpenseCategories,
  deleteCategory,
};
