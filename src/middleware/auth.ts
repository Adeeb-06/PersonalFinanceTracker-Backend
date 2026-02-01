import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

interface AuthenticatedRequest extends Request {
    userEmail?: string;
    userId?: string;
}

export const verifyAuth = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    console.log("Incoming cookies:", req.cookies);

   try {
     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

     console.log("Decoded token:", token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userEmail = token.email as string;
    req.userId = token.id as string;
    next();
   } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
   }
}