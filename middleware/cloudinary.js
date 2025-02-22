import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "shmulky",
  api_key: "469278466838615",
  api_secret: "CoHEyM3Xmzd2of69Jz5Jfqbkplg",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    public_id: (req, file) => `post-${Date.now()}`,
  },
});

const upload = multer({ storage });

export default upload;
