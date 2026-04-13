import multer from "multer";
import ApiError from "../utils/api-error";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 10 MB
  },
  fileFilter(req, file, cb) {
    const allowed = ["image/png", "image/jpg", "image/jpeg"];
    
    if (!allowed.includes(file.mimetype)) cb(ApiError.badRequest("only png, jpg, jpeg files allowed"));
    cb(null, true);
  },
  storage,
});

export { upload };