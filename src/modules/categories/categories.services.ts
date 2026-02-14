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
  console.log(categories, "ser");
  return categories;
};

const getExpenseCategories = async (userEmail: string) => {
  const categories = await CategoryModel.find({ userEmail, type: "expense" });
  return categories;
};

const deleteCategory = async (id: string) => {
  const category = await CategoryModel.findByIdAndDelete(id);
  const otherCategory = await CategoryModel.findOne({
    name: "Other",
  });
  if (!otherCategory) {
    await CategoryModel.create({
      name: "Other",
      type: category?.type,
      userEmail: category?.userEmail,
    });
  }
  await ExpenseModel.updateMany({ category: id }, { category: "Other" });
  await otherCategory?.transactions.push(...category?.transactions);
  await otherCategory?.save();
  await BalanceModel.updateMany({ category: id }, { category: "Other" });
  await otherCategory?.transactions.push(...category?.transactions);
  await otherCategory?.save();
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getIncomeCategories,
  getExpenseCategories,
  deleteCategory,
};
