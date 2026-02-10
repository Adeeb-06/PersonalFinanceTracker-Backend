import mongoose, { Schema, model } from "mongoose";

interface ICategory {
  name: string;
  type: "income" | "expense";
  userEmail: string;
  transactions: string[];
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: (doc: any) => (doc.type === "expense" ? "Expense" : "Income"),
      },
    ],
  },
  { timestamps: true },
);

const CategoryModel =  mongoose.models.Category || model<ICategory>("Category", CategorySchema);

export default CategoryModel;
