import bcrypt from "bcryptjs";
import User from "./user.model"
import { UserDTO } from "./user.types";

export const createUser = async (data: UserDTO) => {
  const userExist = await User.findOne({ email: data.email });

  if (userExist) {
    throw new Error("User already exists");
  }

  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(data.password, salt);

  return await User.create({ ...data, password });
}