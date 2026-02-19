import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userEmail?: string;
  userId?: string;
}

export const verifyAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;

    req.userEmail = payload.email;
    req.userId = payload.id;

    next();
  } catch (err) {
    console.error("verifyAuth Error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
