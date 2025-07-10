import express from "express";
const router = express.Router();
import multer from "multer";
import fs from "fs";
import {
  submitFormData,
  getStudentData,
  getDataById,
  getLocationData,
  editFormData,
  deleteStudentRecords,
} from "../controllers/userController.js";

// Create 'uploads' directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadProfile = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post(
  "/submitFormData",
  uploadProfile.single("profile"),
  submitFormData
);
router.get("/getStudentData", getStudentData);
router.get("/getDataById", getDataById);
router.post("/editFormData", uploadProfile.single("profile"), editFormData);
router.get("/getLocationData", getLocationData);
router.post("/deleteStudentRecord", deleteStudentRecords);

export default router;