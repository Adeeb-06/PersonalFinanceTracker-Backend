import { Router } from "express";
import SavingsController from "./savings.controller";
import { verifyAuth } from "../../middleware/auth";

const SavingRouter = Router();

SavingRouter.post("/add", verifyAuth, SavingsController.addSavings);
SavingRouter.put(
  "/add-money/:id",
  verifyAuth,
  SavingsController.addMoneyToSavings,
);
SavingRouter.get("/get/:email",verifyAuth,SavingsController.getSavingsData)

export default SavingRouter;
