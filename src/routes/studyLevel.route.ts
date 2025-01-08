import express from "express";
import getStudyLevelById, { createStudyLevel, deleteStudyLevel, getAllStudyLevels, updateStudyLevel } from "../controllers/studyLevel.controller";

const router = express.Router();

// Route to get all levels
router.get("/studyLevels", getAllStudyLevels);

// Route to create a new level
router.post("/studyLevels", createStudyLevel);

// Route to update a level by id
router.put("/studyLevels/:id", updateStudyLevel);

// Route to delete a level by id
router.delete("/studyLevels/:id", deleteStudyLevel);

router.get("/studyLevels/:id", getStudyLevelById);

export default router;
