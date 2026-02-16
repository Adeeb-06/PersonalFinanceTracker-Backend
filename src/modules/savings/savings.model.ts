import mongoose from "mongoose";
import { SavingsDTO } from "./savings.types";




const savingsSchema = new mongoose.Schema<SavingsDTO>({
    email:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    targetAmount:{
        type:Number,
        required:true
    },
    currentAmount:{
        type:Number,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    }
},
{
    timestamps:true
}
)

const Savings = mongoose.models.Savings || mongoose.model("Savings",savingsSchema)

export default Savings