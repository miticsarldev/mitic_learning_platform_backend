import express from "express";
import {
    createProgress,
    updateProgress,
    getProgressByCourse,
    getAllProgressForUser,
    deleteProgress
} from "../controllers/progress.controller";

const router = express.Router();

router.post("/progress", createProgress); // Créer une progression
router.put("/progress", updateProgress); // Mettre à jour la progression
router.get("/progress/:user_id/:course_id", getProgressByCourse); // Voir une progression
router.get("/progress/:user_id", getAllProgressForUser); // Voir toutes les progressions
router.delete("/progress/:user_id/:course_id", deleteProgress); // Supprimer une progression

export default router;
