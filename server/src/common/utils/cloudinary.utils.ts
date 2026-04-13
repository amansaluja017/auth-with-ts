import { v2 as Cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./api-error";

Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET!,
});

export const uploadImage = async (localFilePath: string) => {
  if (!localFilePath) return null;

  try {
    const upload = await Cloudinary.uploader.upload(localFilePath, {
      resourceType: "image",
    });
    fs.unlinkSync(localFilePath);
    return upload.secure_url;
  } catch (error: unknown) {
    fs.unlinkSync(localFilePath);
    if (error instanceof Error) {
      throw ApiError.internalError(error.message)
    }
    throw ApiError.internalError("Internal error, failed to upload file to cloudinary!");
  }
};

export const deleteImage = async (public_id: string) => {
  if (!public_id) return null;

  try {
    await Cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("failed to delete", error);
  }
};