import { Router } from "express";
import { addBalance, getBalanceData } from "./balance.controller";
import { verifyAuth } from "../../middleware/auth";

const balanceRoute = Router()

balanceRoute.post("/add-balance" , verifyAuth, addBalance);
balanceRoute.get("/get-balance/:userEmail", verifyAuth, getBalanceData);


export default balanceRoute;