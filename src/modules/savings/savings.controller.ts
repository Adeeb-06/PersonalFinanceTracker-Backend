import { Request, Response } from "express";
import SavingsServices from "./savings.services";

const addSavings = async (req: Request, res: Response) => {
  try {
    const { email, title, targetAmount, currentAmount, deadline } =
      req.body as {
        email: string;
        title: string;
        targetAmount: number;
        currentAmount: number;
        deadline: Date;
      };
    await SavingsServices.addSavings({
      email,
      title,
      targetAmount,
      currentAmount,
      deadline,
    });
    return res.status(200).json({ message: "Savings added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addMoneyToSavings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    await SavingsServices.addMoneyToSavings(id as string, amount);
    return res.status(200).json({ message: "Money added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSavingsData = async (req:Request,res:Response)=>{
  try {
    const {email} = req.params
    const data = await SavingsServices.getSavings(email as string)
    return res.status(200).json({message:"Savings data fetched successfully",data})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal server error"})
  }
}

const SavingsController = {
  addSavings,
  addMoneyToSavings,
  getSavingsData
};

export default SavingsController;
