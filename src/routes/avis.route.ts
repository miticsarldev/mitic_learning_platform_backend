import { Router } from "express";
import {
    createAvis,
    getAllAvis,
    getAvisById,
    getAvisByItem,
    getResponsesByAvis,
    updateAvis,
    deleteAvis,
    filterAvisByType,
} from "../controllers/avis.controller";

const router = Router();

/**
 * @route POST /api/avis
 * @desc Créer un nouvel avis
 */
router.post("/avis", createAvis);

/**
 * @route GET /api/avis
 * @desc Récupérer tous les avis
 */
router.get("/avis", getAllAvis);

/**
 * @route GET /api/avis/:id
 * @desc Récupérer un avis par ID
 */
router.get("/avis/:id", getAvisById);

/**
 * @route GET /api/avis/item/:itemId
 * @desc Récupérer les avis liés à un élément spécifique (cours, leçon ou exercice)
 */
router.get("/avis/item/:itemId", getAvisByItem);

/**
 * @route GET /api/avis/:id/responses
 * @desc Récupérer les réponses d’un avis spécifique
 */
router.get("/avis/:id/responses", getResponsesByAvis);

/**
 * @route PUT /api/avis/:id
 * @desc Mettre à jour un avis
 */
router.put("/avis/:id", updateAvis);

/**
 * @route DELETE /api/avis/:id
 * @desc Supprimer un avis
 */
router.delete("/avis/:id", deleteAvis);

/**
 * @route GET /api/avis/filter
 * @desc Filtrer les avis par type (cours, leçon ou exercice)
 */
router.get("/avis/filter", filterAvisByType);

export default router;
