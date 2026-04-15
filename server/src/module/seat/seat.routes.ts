import express from "express";
import * as seatController from "./seat.controller";
import { validateUserMiddleware, verifyJwt } from "../auth/user/auth.middleware";
import validate from "../../common/middleware/dto.middleware";
import { SeatsDto } from "../dto/seats.dto";

const router = express.Router();

router.get(
  "/seats/:showId/",
  seatController.getSeats,
);

router.put("/:showId", validate(SeatsDto) ,verifyJwt, validateUserMiddleware, seatController.bookSeats);

export default router;
