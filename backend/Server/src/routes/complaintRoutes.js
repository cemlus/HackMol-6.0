// export default router;
import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { authenticateToken } from '../middleware/authMiddleware.js';
import { acceptComplaint, addEvidence, callComplaint, fileComplaint, getComplaintById, getComplaintsByPoliceStation, getUserComplaints, recommendation, rejectComplaint, getIPCCharges } from "../controllers/complaintControllers.js";
import { upload } from "../utils/pinata.js"; // ✅ Correct memoryStorage one
import { requestLimiter } from "../middleware/spamMiddleware.js";

dotenv.config();
const router = express.Router();

// Ensure upload directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage (disk-based)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// const upload = multer({ storage: storage });

router.post("/complaintForm",authenticateToken,requestLimiter,upload.array("evidence"),fileComplaint);
router.post("/questionRecommendation",authenticateToken,recommendation)
router.post("/ipccharges",authenticateToken,getIPCCharges)
router.post("/addEvidence",authenticateToken,requestLimiter, upload.array("evidence"),addEvidence);
router.post("/callComplaint",authenticateToken,requestLimiter,callComplaint);
router.get("/userComplaints",authenticateToken,getUserComplaints);
router.post("/complaintById",authenticateToken,getComplaintById);

router.get("/getComplaintsByPoliceStation",authenticateToken,getComplaintsByPoliceStation)
router.post("/acceptComplaint",authenticateToken,acceptComplaint);
router.post("/rejectComplaint",authenticateToken,rejectComplaint);

export default router;
