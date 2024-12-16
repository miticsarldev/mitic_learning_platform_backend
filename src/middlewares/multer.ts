import multer from "multer";
import path from "path";

// Setting the storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check the file type
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|mp4|mkv|avi/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Images only!"));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // Limit file size to 50MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");
// that means image will be the name of input field in the form in the frontend

export default upload;
