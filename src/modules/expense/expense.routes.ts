import { Router } from "express";
import { addExpense, deletExpense, getExpense, getExpenseById, getTotalExpenseByMonth, updateExpense } from "./expense.controller";
import { verifyAuth } from "../../middleware/auth";

const expenseRoute = Router()

expenseRoute.post("/add-expense",verifyAuth, addExpense);
expenseRoute.get("/get-expense/:userEmail", verifyAuth, getExpense);
expenseRoute.get("/get-total-expense-by-month/:userEmail", verifyAuth, getTotalExpenseByMonth)
expenseRoute.get("/get-expense-by-id/:id", verifyAuth, getExpenseById);
expenseRoute.put("/update-expense/:id", verifyAuth, updateExpense);
expenseRoute.delete("/delete-expense/:id", verifyAuth, deletExpense);

export default expenseRoute;