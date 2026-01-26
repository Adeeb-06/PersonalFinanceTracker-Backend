import express from "express";
import userRouter from "./modules/user/user.route";
import dotenv from "dotenv";
dotenv.config();

import { connectToDatabase } from "./config/mongodb";

connectToDatabase();

const app = express();
const port: Number = 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
