import { Router } from "express";
import { getDashboardData } from "./dashboard.controller";
import { verifyAuth } from "../../middleware/auth";

const dashboardRouter = Router();

dashboardRouter.get("/report/:email",verifyAuth, getDashboardData);

export default dashboardRouter;