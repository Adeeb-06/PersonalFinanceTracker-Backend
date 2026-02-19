import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

interface AuthenticatedRequest extends Request {
  userEmail?: string;
  userId?: string;
}

export const verifyAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("verifyAuth middleware called");
    console.log("Headers:", JSON.stringify(req.headers));
    console.log("Cookies:", req.cookies);

    const sessionToken = req.headers.authorization?.split(" ")[1];


    console.log(req)
    const token = jwt.verify(sessionToken as string, process.env.NEXTAUTH_SECRET!)

    console.log("Token retrieved:", token);

    if (!token) {
      console.log("Unauthorized: No token found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userEmail = (token as any).email as string;
    req.userId = (token as any).id as string;
    next();
  } catch (error) {
    console.error("verifyAuth Error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
