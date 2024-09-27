import { Request, Response, NextFunction } from "express";
import productCreateSchema from "../schema/product.schema";

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await productCreateSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export default validateRequest;
