import multer from "multer";
import { diskStorage } from "multer";

export const uploadFileCloud = () => {
  const fileFilter = (req, file, cb) => {
    // check mimetype
    if (!["image/png", "image/jpeg"].includes(file.mimetype))
      return cb(new Error("invalid format"), false);
    return cb(null, true);
  };

  return multer({ storage: diskStorage({}), fileFilter });
};
