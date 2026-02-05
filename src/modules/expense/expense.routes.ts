import { Router } from "express";
import { addExpense, getExpense } from "./expense.controller";
import { verifyAuth } from "../../middleware/auth";

const expenseRoute = Router()

expenseRoute.post("/add-expense",verifyAuth, addExpense);
expenseRoute.get("/get-expense/:userEmail", verifyAuth, getExpense);

export default expenseRoute;