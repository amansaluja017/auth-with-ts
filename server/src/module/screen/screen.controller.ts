import { Response, Request } from "express";
import { getScreensService, registerScreenService } from "./screen.service";
import ApiResponse from "../../common/utils/api-response";

export const registerScreen = async (req: Request, res: Response) => {
  await registerScreenService(req.body);

  ApiResponse.ok(res, "screen created successfully");
};

export const getScreens = async (_: Request, res: Response) => {
  const screens = await getScreensService();

  ApiResponse.ok(res, "screens fetched successfully", screens);
};