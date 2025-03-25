import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

console.log("cloudinary");

cloudinary.config({
	cloud_name: "dmv3souam",
	api_key: "823766963339684",
	api_secret: "KiUR4mPC15TBhRW9ZZ6FElLtUbQ",
});

export default cloudinary;
