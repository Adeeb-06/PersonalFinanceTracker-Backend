import mongoose from "mongoose";
import { BudgetDTO } from "./budget.types";

const budgetSchema = new mongoose.Schema<BudgetDTO>({
    userEmail: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    spent: { type: Number , default: 0 },
    remaining: { type: Number , default: 0 },
})

const BudgetModel = mongoose.models.Budget || mongoose.model<BudgetDTO>("Budget", budgetSchema)

export default BudgetModel