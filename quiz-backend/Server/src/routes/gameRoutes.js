import express from "express";
import {
    getActiveLocation,
    getRiddle,
    submitAnswer,
    hasCompletedRiddleOfThisTask,
    completeOfflineTask,
    getLeaderboard,
    // getProgress
} from "../controllers/gameController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

// router.post("/start", authenticateToken, startGame);
// router.get("/riddle", authenticateToken, getRiddle);
// router.post("/answer", authenticateToken, submitAnswer);
// router.post("/start-offline-task", authenticateToken, startOfflineTask);
// router.post("/complete-task", authenticateToken, completeOfflineTask);
// router.get("/progress", authenticateToken, getProgress);


router.get("/getActiveLocation", authenticateToken, getActiveLocation);
router.post("/riddle", authenticateToken, getRiddle);
router.post("/answer", authenticateToken, submitAnswer);
//admin routes
router.post("/hasCompletedRiddleOfThisTask", authenticateToken, hasCompletedRiddleOfThisTask);
router.post("/complete-task", authenticateToken, completeOfflineTask);
// router.get("/progress", authenticateToken, getProgress);
router.get("/leaderboard",authenticateToken, getLeaderboard);

export default router;
