import mongoose, { model, Schema } from "mongoose";
import { BalanceDTO } from "./balance.types";

const balanceSchema = new Schema<BalanceDTO>({
  userEmail: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
});

const BalanceModel =
  mongoose.models.Balance || model<BalanceDTO>("Balance", balanceSchema);

export default BalanceModel;
