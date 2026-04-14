import BaseDto from "../../common/utils/dto.config";
import { z } from "zod";

class RegisterDto extends BaseDto {
  static schema = z
    .object({
      name: z.string().min(2).max(45),
      screenId: z.string(),
      start: z.string().transform((val) => new Date(val)),
      end: z.string().transform((val) => new Date(val)),
      genre: z.enum(["Action", "Drama", "Comedy", "Sci-Fi", "Romance", "Fantasy"]),
    })
    .strict();
}

export { RegisterDto };