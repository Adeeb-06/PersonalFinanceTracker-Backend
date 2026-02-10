export interface ICategory {
  _id: string;
  name: string;
  type: "income" | "expense";
  userEmail: string;
  transactions: string[];
}