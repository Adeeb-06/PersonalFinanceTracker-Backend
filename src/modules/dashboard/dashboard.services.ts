import BalanceModel from "../balance/balance.model"
import ExpenseModel from "../expense/expense.model"
import User from "../user/user.model"

const getBalance = async (email: string) => {
    const user = await User.findOne({email })
    return user?.balance
}

const getTotalIncomeByMonth = async (email: string , month: number , year:number) => {
    console.log(year, month , email)
    const res = await BalanceModel.aggregate([
        {
            $match: {
                userEmail: email,
                date: {
                    $gte: new Date(year, month - 1, 1),
                    $lt: new Date(year, month, 1)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$amount" }
            }
        }
    ])
    console.log(res)
    return res[0]?.totalIncome
}

const getTotalExpenseByMonth = async (email: string , month: number , year:number) => {
    console.log(year , month , email)
    const res = await ExpenseModel.aggregate([
        {
            $match: {
                userEmail: email,
                date: {
                    $gte: new Date(year, month - 1, 1),
                    $lt: new Date(year, month, 1)
                }
            }
        },
        {
            $group: {
                _id: null,
                totalExpense: { $sum: "$amount" }
            }
        }
    ])
    console.log(res)
    return res[0]?.totalExpense
}


const DashboardService = {
    getBalance,
    getTotalIncomeByMonth,
    getTotalExpenseByMonth
}

export default DashboardService