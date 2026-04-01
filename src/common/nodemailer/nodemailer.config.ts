import nodemailer from "nodemailer";
import ApiError from "../utils/api-error";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const sendMail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to,
      subject,
      html,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw ApiError.internalError(err.message);
    }
    throw ApiError.internalError("internal Error: Failed to send mail");
  }
};

export default sendMail;
