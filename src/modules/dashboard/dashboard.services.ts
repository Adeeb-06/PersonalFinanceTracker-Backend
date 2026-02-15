import BalanceModel from "../balance/balance.model";
import BudgetModel from "../budget/budget.model";
import ExpenseModel from "../expense/expense.model";
import User from "../user/user.model";

const getBalance = async (email: string) => {
  const user = await User.findOne({ email });
  return user?.balance;
};

const getTotalIncomeByMonth = async (
  email: string,
  month: number,
  year: number,
) => {
  console.log(year, month, email);
  const res = await BalanceModel.aggregate([
    {
      $match: {
        userEmail: email,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$amount" },
      },
    },
  ]);
  console.log(res);
  return res[0]?.totalIncome;
};

const getTotalExpenseByMonth = async (
  email: string,
  month: number,
  year: number,
) => {
  console.log(year, month, email);
  const res = await ExpenseModel.aggregate([
    {
      $match: {
        userEmail: email,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" },
      },
    },
  ]);
  console.log(res);
  return res[0]?.totalExpense;
};

const getTotalTransactionByMonth = async (
  email: string,
  month: number,
  year: number,
) => {
  console.log(year, month, email);
  const res = await ExpenseModel.aggregate([
    {
      $match: {
        userEmail: email,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      },
    },
  ]);
  console.log(res.length);
  return res.length;
};

const getTopExpenseCategory = async (
  email: string,
  month: number,
  year: number,
) => {
  console.log(year, month, email);
  const res = await ExpenseModel.aggregate([
    {
      $match: {
        userEmail: email,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      },
    },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
      },
    },
  ]);
  console.log(res, "resss");
  if (res.length === 0) {
    return { category: "No Category", amount: 0 };
  }
  const sortedCategories = res.sort((a: any, b: any) => b.amount - a.amount);
  const topCategory = sortedCategories[0];
  console.log(topCategory);
  return { category: topCategory._id, amount: topCategory.amount };
};

const checkBudgetStatus = async({email,month,year} : {email:string,month:number,year:number})=>{
    const budget = await BudgetModel.findOne({
        userEmail:email,
        data:{
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
        }
    })
    if(!budget){
        return {status:false}
    }
    const isBudgetExceeded = budget?.amount < budget?.spent
    
    return {status: isBudgetExceeded}
}

const DashboardService = {
  getBalance,
  getTotalIncomeByMonth,
  getTotalExpenseByMonth,
  getTotalTransactionByMonth,
  getTopExpenseCategory,
  checkBudgetStatus
};

export default DashboardService;
