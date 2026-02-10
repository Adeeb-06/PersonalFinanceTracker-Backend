import  CategoryModel  from "./categories.model";

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
  console.log(categories, "ser")
  return categories;
};

const getExpenseCategories = async (userEmail: string) => {
  const categories = await CategoryModel.find({ userEmail, type: "expense" });
  return categories;
};

const deleteCategory = async (id: string) => {
  await CategoryModel.findByIdAndDelete(id);
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getIncomeCategories,
  getExpenseCategories,
  deleteCategory,
};
