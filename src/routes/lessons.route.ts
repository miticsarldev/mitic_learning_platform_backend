import { Router } from "express";
import {
    createLesson,
    getAllLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
    getLessonsByCourseId,
    getLessonByOrder,
    filterLessons,
    getLessonsWithPagination,
    getLessonStats,
    searchLessons,
} from "../controllers/lessons.controller";

const router = Router();

// Route pour créer une nouvelle leçon
router.post("/lessons", createLesson);

// Route pour récupérer toutes les leçons
router.get("/lessons", getAllLessons);

// Route pour récupérer une leçon par ID
router.get("/lessons/:id", getLessonById);

// Route pour mettre à jour une leçon par ID
router.put("/lessons/:id", updateLesson);

// Route pour supprimer une leçon par ID
router.delete("/lessons/:id", deleteLesson);

// Route pour récupérer les leçons d'un cours spécifique
router.get("/lessons/course/:course_id", getLessonsByCourseId);

// Route pour récupérer une leçon par ordre dans un cours
router.get("/lessons/order", getLessonByOrder);

// Route pour filtrer les leçons par titre et description
router.get("/lessons/filter", filterLessons);

// Route pour récupérer les leçons avec pagination
router.get("/lessons/paginate", getLessonsWithPagination);

// Route pour obtenir des statistiques sur les leçons
router.get("/lessons/stats", getLessonStats);

// Route pour rechercher des leçons par mots-clés
router.get("/lessons/search", searchLessons);

export default router;
