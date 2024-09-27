import multer from "multer";

const upload = multer({
  dest: "uploads/", // Ensure the uploads directory exists
  // limits: { fileSize: 5 * 1024 * 1024 }, // File size limit 5MB
});

export default upload;
