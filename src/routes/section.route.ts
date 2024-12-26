import { Router } from "express";
import {
    createSection,
    getSectionsByLesson,
    getSectionById,
    updateSection,
    deleteSection,
    getAllSections,
    reorderSections,
    searchSections
} from "../controllers/section.controller";

const router = Router();

/**
 * @route POST /api/sections
 * @desc Créer une nouvelle section
 */
router.post("/sections", createSection);

/**
 * @route GET /api/sections
 * @desc Récupérer toutes les sections
 */
router.get("/sections", getAllSections);

/**
 * @route GET /api/sections/lesson/:lesson_id
 * @desc Récupérer toutes les sections d'une leçon spécifique
 */
router.get("/sections/lesson/:lesson_id", getSectionsByLesson);

/**
 * @route GET /api/sections/:id
 * @desc Récupérer une section par ID
 */
router.get("/sections/:id", getSectionById);

/**
 * @route PUT /api/sections/:id
 * @desc Mettre à jour une section
 */
router.put("/sections/:id", updateSection);

/**
 * @route DELETE /api/sections/:id
 * @desc Supprimer une section
 */
router.delete("/sections/:id", deleteSection);

/**
 * @route PUT /api/sections/reorder/:lesson_id
 * @desc Réordonner les sections d'une leçon
 */
router.put("/sections/reorder/:lesson_id", reorderSections);

/**
 * @route GET /api/sections/search
 * @desc Rechercher des sections par titre ou description
 * @query {query} : Requête de recherche
 */
router.get("/sections/search", searchSections);

export default router;
