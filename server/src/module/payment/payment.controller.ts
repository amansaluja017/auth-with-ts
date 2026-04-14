import { Request, Response } from "express";
import { createPaymentService, verifyPaymentService } from "./payment.service";
import ApiResponse from "../../common/utils/api-response";


export const createPayment = async (req: Request, res: Response) => {
  
  const order = await createPaymentService(req.body);
  
  ApiResponse.ok(res, "Payment order created successfully", order);
};

export const verifyPayment = async (req: Request, res: Response) => {
  console.log(req.customer);
  
  await verifyPaymentService(req.body, req.customer.id);
  
  ApiResponse.ok(res, "Payment verified successfully");
};