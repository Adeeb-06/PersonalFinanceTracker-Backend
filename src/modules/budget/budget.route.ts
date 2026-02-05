import { Router } from "express";
import { addBudget, getBudget } from "./budget.controller";
import { verifyAuth } from "../../middleware/auth";

const budgetRoute = Router()

budgetRoute.post("/add-budget", verifyAuth, addBudget);
budgetRoute.get("/get-budget/:userEmail", verifyAuth, getBudget);

export default budgetRoute;