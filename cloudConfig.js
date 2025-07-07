const cloudinary = require("cloudinary").v2; // Import Cloudinary library
const { CloudinaryStorage } = require("multer-storage-cloudinary"); // Import Cloudinary storage for Multer

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Cloudinary account name
  api_key: process.env.CLOUD_API_KEY, // API key for authentication
  api_secret: process.env.CLOUD_API_SECRET, // API secret for authentication
});

// Set up Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary, // Cloudinary instance
  params: {
    folder: 'wanderlust_DEV', // Folder name in Cloudinary
    allowed_formats: ["png", "jpg", "jpeg"], // Allowed file formats
  },
});

// Export Cloudinary and storage configuration
module.exports = {
  cloudinary,
  storage,
};
