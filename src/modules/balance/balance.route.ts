import { Router } from "express";
import { addBalance } from "./balance.controller";
import { verifyAuth } from "../../middleware/auth";

const balanceRoute = Router()

balanceRoute.post("/add-balance" , verifyAuth, addBalance);


export default balanceRoute;