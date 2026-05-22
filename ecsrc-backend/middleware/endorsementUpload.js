const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,

      "uploads/endorsements",
    );
  },

  filename: (req, file, cb) => {
    cb(
      null,

      Date.now() + path.extname(file.originalname),
    );
  },
});

const endorsementUpload = multer({
  storage,
});

module.exports = endorsementUpload;
