import { NextFunction, Request, Response } from "express";
import ApiError from "../../common/utils/api-error";
import { verifyAccessToken } from "../../common/utils/jwt.utils";
import { CustomerTypes } from "./auth.service";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // res.clearCookie("accessToken").clearCookie("refreshToken")
  if (!req.headers["authorization"]) return next();
  
  if (!req.headers["authorization"]?.startsWith("Bearer")) throw ApiError.unauthorized("You are not authorized!");

  const token =
    req.headers["authorization"]?.split(" ")[1] ||
    (req.cookies?.accessToken as string);

  if (!token) throw ApiError.unauthorized("You are not authorized!");

  const decoded = verifyAccessToken(res, token) as CustomerTypes;
  if (!decoded.role || decoded.role !== "customer")
    throw ApiError.unauthorized("You are not authorized to do this action");

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, decoded.id));

  if (!user) throw ApiError.unauthorized("You are not authorized!");

  req.customer = decoded;
  next();
};

export const validateUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.customer)
    throw ApiError.unauthorized("You are not login, Please login first!");
  next();
};
