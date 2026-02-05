import express from "express";
import userRouter from "./modules/user/user.route";
import dotenv from "dotenv";
import cors from "cors";
import cookiesParser from "cookie-parser";

dotenv.config();

import { connectToDatabase } from "./config/mongodb";
import balanceRoute from "./modules/balance/balance.route";
import expenseRoute from "./modules/expense/expense.routes";
import budgetRoute from "./modules/budget/budget.route";

connectToDatabase();

const app = express();
const port: Number = 9000;


app.use(cookiesParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/balance", balanceRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/budget", budgetRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
