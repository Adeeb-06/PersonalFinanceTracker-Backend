import mongoose from "mongoose";
import { ExpenseDTO } from "./expense.type";

const expenseSchema = new mongoose.Schema<ExpenseDTO>({
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
})

const ExpenseModel = mongoose.models.Expense || mongoose.model<ExpenseDTO>("Expense", expenseSchema)

export default ExpenseModel