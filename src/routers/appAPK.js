const express = require("express");
const router = new express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage configuration
const uploadDir = path.join(__dirname, "uploadsAPK");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure folder exists
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, "app.apk"); // Overwrites existing APK
    }
});

const upload = multer({ storage });

// ✅ Upload APK (POST)
router.post("/upload-apk", upload.single("apk"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, msg: "No file uploaded" });
        }
        res.json({ status: true, msg: "APK uploaded successfully", filename: req.file.filename });
    } catch (error) {
        console.error("Error uploading APK:", error);
        res.status(500).json({ status: false, msg: "Failed to upload APK" });
    }
});

// ✅ Update APK (PATCH)
router.patch("/update-apk", upload.single("apk"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, msg: "No file uploaded" });
        }
        res.json({ status: true, msg: "APK updated successfully", filename: req.file.filename });
    } catch (error) {
        console.error("Error updating APK:", error);
        res.status(500).json({ status: false, msg: "Failed to update APK" });
    }
});

// ✅ Download APK (GET)
router.get("/download-apk", async (req, res) => {
    try {
        const filePath = path.join(__dirname, "uploadsAPK", "app.apk"); // Corrected path

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ status: false, msg: "APK file not found" });
        }

        res.download(filePath, "my-app.apk", (err) => {
            if (err) {
                console.error("Error downloading APK:", err);
                res.status(500).json({ status: false, msg: "Failed to download APK" });
            }
            res.json({ status: true, msg: "APK downloaded successfully"});
        });
    } catch (error) {
        console.error("Error serving APK:", error);
        res.status(500).json({ status: false, msg: "Failed to serve APK" });
    }
});

module.exports = router;
