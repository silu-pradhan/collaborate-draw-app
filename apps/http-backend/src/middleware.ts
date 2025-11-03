import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SCRET } from "./config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  const decoded = jwt.verify(token, JWT_SCRET);
  if (decoded) {
    // @ts-ignore
    req.userId = decoded.userId;
    next();
  } else {
    res.status(401).json({
      message: "unauthorized",
    });
  }
}
