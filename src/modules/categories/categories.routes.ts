import express from "express";
import { CategoryController } from "./categories.controllers";
import { verifyAuth } from "../../middleware/auth";

const router = express.Router();

router.post("/create-category", verifyAuth, CategoryController.createCategory);
router.get("/:userEmail", verifyAuth, CategoryController.getAllCategories);
router.get("/income/:userEmail", verifyAuth, CategoryController.getIncomeCategories);
router.get("/expense/:userEmail", verifyAuth, CategoryController.getExpenseCategories);
router.get("/analytics/:userEmail", verifyAuth, CategoryController.getCategoryAnalytics);
router.delete("/:id", verifyAuth, CategoryController.deleteCategory);

export const CategoryRoutes = router;
