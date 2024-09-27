const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_KEY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "social",
    format: async (req, file) => "jpeg",
    public_id: (req, file) => {
      const { baseUrl } = req;
      const route = baseUrl.slice(1, baseUrl.length);
      if (route === "comments") return `${file.fieldname}_${req.params.id}`;

      return `${file.fieldname}_${req.user._id}`;
    },
  },
});

const upload = multer({ storage });

module.exports = upload;
