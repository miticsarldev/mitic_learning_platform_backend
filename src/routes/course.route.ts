import express from "express";
import { createCourse, deleteCourse, getAllCourse, getCourseById, updateCourse } from "../controllers/course.controller";
import upload from "../middlewares/multer";
const router = express.Router();

// Route pour créer un cours
router.post("/course", upload ,  createCourse);

// Route pour obtenir tous les cours
router.get("/course", getAllCourse);

// Route pour obtenir un cours par ID
router.get("/course/:id", getCourseById);

// Route pour mettre à jour un cours
router.put("/course/:id", updateCourse);

// Route pour supprimer un cours
router.delete("/course/:id", deleteCourse);

export default router;
