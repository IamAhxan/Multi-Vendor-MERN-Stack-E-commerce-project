import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Keep files in memory — multer-storage-cloudinary is NOT compatible with multer v2
export const upload = multer({ storage: multer.memoryStorage() });

/**
 * Upload a single buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer from req.file.buffer
 * @param {string} folder  - Cloudinary folder name
 * @returns {Promise<string>} - The secure Cloudinary URL
 */
export const uploadToCloudinary = (buffer, folder = "multi-vendor") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "auto" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};
