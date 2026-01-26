import { User } from "./user.model"
import { UserDTO } from "./user.types";

export const createUser = async (data: UserDTO) => {
  const userExist = await User.findOne({ email: data.email });

  if (userExist) {
    throw new Error("User already exists");
  }

  return await User.create(data);
}