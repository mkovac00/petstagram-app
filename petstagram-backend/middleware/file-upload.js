const multer = require("multer");
const { v1: uuidv1 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const imgExtension = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv1() + "." + imgExtension);
    },
  }),
  fileFilter: (req, file, cb) => {
    // ovaj !! isprid znaci da ako pronađe ili png ili jpeg ili jpg
    // u MIME_TYPE_MAP onda ce isValid postat true, a ako ne pronađe
    // onda ce isValid bit false
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid image type.");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
