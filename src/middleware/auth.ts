import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userEmail?: string;
  userId?: string;
}

export const verifyAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!);

    req.userEmail = (payload as any).email;
    req.userId = (payload as any).id;
    next();
  } catch (err) {
    console.error("verifyAuth Error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
