import { NextFunction, Request, Response } from "express";
import { getToken } from "next-auth/jwt";

interface AuthenticatedRequest extends Request {
  userEmail?: string | null | undefined;
  userId?: string | unknown | undefined;
}

export const verifyAuth = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    req.userEmail = token.email;
    req.userId = token.id;
    next();
  } catch (err) {
    console.error("verifyAuth Error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
