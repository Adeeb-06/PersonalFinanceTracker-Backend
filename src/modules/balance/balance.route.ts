import { Router } from "express";
import { addBalance, deleteIncome, getIncomeData } from "./balance.controller";
import { verifyAuth } from "../../middleware/auth";

const balanceRoute = Router()

balanceRoute.post("/add-balance" , verifyAuth, addBalance);
balanceRoute.get("/get-income-data/:userEmail", verifyAuth, getIncomeData);
balanceRoute.delete("/delete-income/:id", verifyAuth, deleteIncome);


export default balanceRoute;