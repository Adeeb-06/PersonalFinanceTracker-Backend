import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase-admin";

interface AuthenticatedRequest extends Request {
  userEmail?: string;
  userId?: string;
  firebaseUid?: string;
}

export const verifyAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1]; // Bearer <token>

    const decoded = await admin.auth().verifyIdToken(token);

    req.userEmail = decoded.email;
    req.firebaseUid = decoded.uid;
    req.userId = decoded.uid;

    next();
  } catch (err) {
    console.error("verifyAuth Error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
