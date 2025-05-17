const multer = require("multer");

// Config how and where files are stored on disk
const storage = multer.diskStorage({
  // Destination folder for uploaded files
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  // Naming the uploaded files
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}}`);
  },
});

// Filter to only allow specific file types (media types)
const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only .jpeg, .png and .jpg are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
