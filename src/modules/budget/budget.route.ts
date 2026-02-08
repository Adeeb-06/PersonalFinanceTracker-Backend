import { Router } from "express";
import { addBudget, getBudget, getBudgetByMonth } from "./budget.controller";
import { verifyAuth } from "../../middleware/auth";

const budgetRoute = Router()

budgetRoute.post("/add-budget", verifyAuth, addBudget);
budgetRoute.get("/get-budget/:userEmail", verifyAuth, getBudget);
budgetRoute.get("/get-budget-by-month/:userEmail", verifyAuth, getBudgetByMonth);

export default budgetRoute;