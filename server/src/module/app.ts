import express from "express";
import { Express } from "express";
import cors from "cors";
import authRouter from "./auth/user/auth.routes";
import adminRouter from "./auth/admin/admin.auth.routes";
import cookieParser from "cookie-parser";
import { validateUserMiddleware, verifyJwt } from "./auth/user/auth.middleware";
import { adminVerifyJwt, validateAdminMiddleware } from "./auth/admin/admin.auth.middleware";
import screenRoutes from "./screen/screen.routes";
import showRoutes from "./show/show.routes";
import seatRoutes from "./seat/seat.routes";
import paymentRoutes from "./payment/payment.routes";

function createExpressServer(): Express {
  const app = express();
  
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/customer", verifyJwt, authRouter);
  app.use("/admin", adminVerifyJwt, adminRouter);
  app.use("/screen", adminVerifyJwt, validateAdminMiddleware, screenRoutes);
  app.use("/", showRoutes);
  app.use("/", seatRoutes);
  app.use("/payment", verifyJwt, paymentRoutes);

  return app;
}

export default createExpressServer;
