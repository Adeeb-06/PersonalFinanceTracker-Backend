import { Router } from "express";
import { addExpense, getExpense, getTotalExpenseByMonth } from "./expense.controller";
import { verifyAuth } from "../../middleware/auth";

const expenseRoute = Router()

expenseRoute.post("/add-expense",verifyAuth, addExpense);
expenseRoute.get("/get-expense/:userEmail", verifyAuth, getExpense);
expenseRoute.get("/get-total-expense-by-month/:userEmail", verifyAuth, getTotalExpenseByMonth);

export default expenseRoute;