import { Router } from "express";
import {
  addBalance,
  deleteIncome,
  getIncomeById,
  getIncomeData,
  updateIncome,
} from "./balance.controller";
import { verifyAuth } from "../../middleware/auth";

const balanceRoute = Router();

balanceRoute.post("/add-balance", verifyAuth, addBalance);
balanceRoute.get("/get-income-data/:userEmail", verifyAuth, getIncomeData);
balanceRoute.delete("/delete-income/:id", verifyAuth, deleteIncome);
balanceRoute.put("/update-income/:id", verifyAuth, updateIncome);
balanceRoute.get("/get-income-by-id/:id", verifyAuth, getIncomeById);

export default balanceRoute;
