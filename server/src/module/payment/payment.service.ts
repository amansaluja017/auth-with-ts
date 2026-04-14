import ApiError from "../../common/utils/api-error";
import razorpay from "../../common/utils/razorpay.config";
import crypto from "node:crypto";
import { db } from "../../db";
import { invoiceTable, paymentTable } from "../../db/schema";

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export const createPaymentService = async ({
  amount,
  currency,
  receipt,
}: {
  amount: number;
  currency: string;
  receipt: string;
}) => {
  try {
    const order = razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt,
    });
    
    if (!order) throw ApiError.internalError("Failed to create payment order");
    
    return order;
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw ApiError.internalError(error.message);
    }
    
    throw ApiError.internalError("Failed to create payment order");
  }
};

export const verifyPaymentService = async ({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}, customerId: string) => {
  try {
    
    const hmac = crypto.createHmac("sha256", process.env.ROZARPAY_TEST_API_KEY_SECRET!);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");
    
    if (generated_signature !== signature) {
      throw ApiError.internalError("Failed to verify payment");
    }
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    if (payment.status !== "captured") {
      throw ApiError.internalError("Payment not captured");
    }
    
    const [paymentData] = await db.insert(paymentTable).values({
      userId: customerId,
      transactionId: payment.id,
      paymentMethod: payment.method as PaymentMethod,
      amount: Number(payment.amount) / 100,
      paymentStatus: "success",
    }).returning();
    
    await db.insert(invoiceTable).values({
      userId: customerId,
      paymentId: paymentData?.paymentId!
    });
        
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw ApiError.internalError(error.message);
    }
    
    throw ApiError.internalError("Failed to verify payment");
  }
};
