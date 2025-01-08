import express from "express";
import { createCourse, createCourseWithLessonsAndSections, deleteCourse, getAllCourse, getCourseById, getCourseDetails, getCourseEnrollmentStats, getCoursesByTeacher, updateCourse } from "../controllers/course.controller";
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

router.post('/course/allInfos', createCourseWithLessonsAndSections)

// Route pour récupérer le nombre d'inscriptions par cours
router.get('/course/enrollments/:userId', getCourseEnrollmentStats);

router.get("/course/getCourseAllInfo/:courseId", getCourseDetails);

// Route pour récupérer les cours par professeur
router.get("/course/teacher/:teacherId", getCoursesByTeacher);

export default router;
