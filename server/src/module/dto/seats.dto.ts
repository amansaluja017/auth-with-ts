import BaseDto from "../../common/utils/dto.config";
import { z } from "zod";

class SeatsDto extends BaseDto {
  static schema = z
    .object({
      seatIds: z.array(z.string()).nonempty().min(1),
    })
    .strict();
}

export { SeatsDto };