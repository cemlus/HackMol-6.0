import express from "express";
import { 
    fileComplaint,
    addEvidence,
    acceptComplaint,
    rejectComplaint,
    getComplaintById,
    getAllComplaints,
    getComplaintsByVictim,
    // getComplaintsByPoliceStation,
    isPoliceStation,
    addPoliceStation,
    removePoliceStation,
    // getComplaintCount,
    // getOwner
} from "../controllers/testControllers.js";
import { upload } from "../utils/pinata.js";

const router = express.Router();

router.post("/file",
    upload.fields([{
        name: "proofs",
        maxCount: 5
    }]),
     fileComplaint);
router.post("/addEvidence", addEvidence);

router.post("/accept", acceptComplaint);
router.post("/reject", rejectComplaint);

router.get("/complaints/all", getAllComplaints);
router.get("/complaints/:complaintId", getComplaintById);
// router.get("/complaints/victim/:victimAddress", getComplaintsByVictim);
// router.get("/complaints/station/:stationAddress", getComplaintsByPoliceStation);
router.get("/complaints/station/:stationAddress", isPoliceStation);
// router.get("/complaints/count", getComplaintCount);

router.post("/admin/addStation", addPoliceStation);
// router.post("/admin/removeStation", removePoliceStation);
// router.get("/admin/owner", getOwner);

export default router;