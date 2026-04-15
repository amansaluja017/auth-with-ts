import { Request, Response } from "express";
import ApiResponse from "../../common/utils/api-response";
import { createShowService, getShowsAllService, getShowsService } from "./show.service";
import ApiError from "../../common/utils/api-error";

export const createShow = async (req: Request, res: Response) => {
  const show = await createShowService(req.body);

  ApiResponse.createdUser(res, "Show created successfully", show);
};

export const getAllShows = async (
  req: Request<any, any, any, { limit: number; page: number }>,
  res: Response,
) => {
  if (!req.query.limit || !req.query.page) throw ApiError.badRequest("Invalid page and limit");
  
  const shows = await getShowsAllService(req.query);

  ApiResponse.ok(res, "Shows fetch successfully", shows);
};

export const getScreenShow = async (req: Request<{ screenId: string }>, res: Response) => {
  
  if (!req.params.screenId) throw ApiError.badRequest("Invalid screenId");
  
  const shows = await getShowsService(req.params);

  ApiResponse.ok(res, "Show fetch successfully", shows);
};
