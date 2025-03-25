import multer from "multer";
import storage from "../config/cloudinaryStorage";

const upload = multer({ storage });

export default upload;
