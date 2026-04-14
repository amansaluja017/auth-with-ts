import BaseDto from "../../common/utils/dto.config";
import { z } from "zod";

class CreatePaymentDto extends BaseDto {
  static schema = z
    .object({
      amount: z.number().positive(),
      currency: z.string().min(3).max(3),
      receipt: z.string(),
    })
    .strict();
}

class VerifyPaymentDto extends BaseDto {
  static schema = z.object({
    paymentId: z.string(),
    orderId: z.string(),
    signature: z.string(),
  }).strict();
}

export { CreatePaymentDto, VerifyPaymentDto };
