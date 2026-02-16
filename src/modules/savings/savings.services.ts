import Savings from "./savings.model";
import { SavingsDTO } from "./savings.types";
import mongoose from "mongoose";

const addSavings = async (savings: SavingsDTO) => {
  try {
    const { email, title, targetAmount, currentAmount, deadline } = savings;
    const newSavings = new Savings({
      email,
      title,
      targetAmount,
      currentAmount,
      deadline,
    });
    await newSavings.save();
    return newSavings;
  } catch (error) {
    throw error;
  }
};

const addMoneyToSavings = async (id: string, amount: number) => {
  try {
    const savings = await Savings.findByIdAndUpdate(
      id,
      { $inc: { currentAmount: amount } },
      { new: true },
    );
    if (!savings) {
      throw new Error("Savings goal not found");
    }
    return savings;
  } catch (error) {
    throw error;
  }
};


const getSavings = async (email:string) => {
  try {
    const res = await Savings.find({ email });
    if (!res) {
      throw new Error("No savings goal found");
    }
    return res
  } catch (error) {
    throw error
  }
};

const getSavingsById = async (savingsId:string , email:string) => {
  try {
    console.log(savingsId , email)
    const res = await Savings.findOne({_id:savingsId , email});
    if (!res) {
      throw new Error("No savings goal found");
    }
    return res
  } catch (error) {
    throw error
  }
}

const updateSavings = async (id: string, savings: Partial<SavingsDTO>) => {
  try {
    const updatedSavings = await Savings.findByIdAndUpdate(id, savings, {
      new: true,
    });
    if (!updatedSavings) {
      throw new Error("Savings goal not found");
    }
    return updatedSavings;
  } catch (error) {
    throw error;
  }
};

const deleteSavings = async (id: string) => {
  try {
    const deletedSavings = await Savings.findByIdAndDelete(id);
    if (!deletedSavings) {
      throw new Error("Savings goal not found");
    }
    return deletedSavings;
  } catch (error) {
    throw error;
  }
};

const SavingsServices = {
  addSavings,
  addMoneyToSavings,
  getSavings,
  getSavingsById,
  updateSavings,
  deleteSavings,
};

export default SavingsServices;
