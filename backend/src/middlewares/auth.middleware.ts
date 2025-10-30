// src/middleware/auth.middleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).redirect("/MyLib/")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "access denied" });
    }
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).redirect("/MyLib/");
  }
};
