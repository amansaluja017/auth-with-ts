import { Response, Request } from "express";
import ApiError from "../../common/utils/api-error";
import { bookSeatsService, getSeatsService } from "./seat.service";
import ApiResponse from "../../common/utils/api-response";

export const getSeats = async (
  req: Request<{ showId: string }>,
  res: Response,
) => {
  if (!req.params.showId) throw ApiError.badRequest("Invalid show or screen");

  const { seats, show } = await getSeatsService(req.params);

  ApiResponse.ok(res, "seats fetch successfully", { seats, show });
};

export const bookSeats = async (
  req: Request<{ showId: string }>,
  res: Response,
) => {
  const { id: userId } = req.customer;
  const { showId } = req.params;
  const { seatIds }: { seatIds: string[] } = req.body;

  if (!seatIds || !seatIds.length)
    throw ApiError.badRequest("seat id is Invalid");

  await bookSeatsService({ seatIds, showId, userId });

  ApiResponse.ok(res, "Your seat is booked");
};
