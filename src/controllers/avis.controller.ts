import { Request, Response } from "express";
import Avis from "../models/Avis";
import Course from "../models/Course";

/**
 * @desc Créer un nouvel avis
 * @route POST /api/avis
 */
export const createAvis = async (req: Request, res: Response) => {
    try {
        const { user_id, content, type, item_id, avis_parent_id } = req.body;

        if (!user_id || !content || !type || !item_id) {
            return res.status(400).json({ success: false, message: "Données manquantes" });
        }

        const newAvis = await Avis.create({
            user_id,
            content,
            type,
            item_id,
            avis_parent_id: avis_parent_id || null,
        });

        res.status(201).json({ success: true, data: newAvis });
    } catch (error) {
        res.status(500).json({ success: false, message: "Une ereur est survenue", error });
    }
};

/**
 * @desc Obtenir tous les avis
 * @route GET /api/avis
 */
export const getAllAvis = async (req: Request, res: Response) => {
    try {
        const avis = await Avis.find().populate('user_id').populate("item_id").populate("avis_parent_id")
        res.status(200).json({ success: true, data: avis });
    } catch (error) {
        res.status(500).json({ success: false, message: "Une erreur est survenue", error });
    }
};

/**
 * @desc Obtenir un avis par ID
 * @route GET /api/avis/:id
 */
export const getAvisById = async (req: Request, res: Response) => {
    try {
        const avis = await Avis.findById(req.params.id).populate('user_id').populate("item_id").populate("avis_parent_id")

        if (!avis) {
            return res.status(404).json({ success: false, message: "Avis non trouvé" });
        }

        res.status(200).json({ success: true, data: avis });
    } catch (error) {
        res.status(500).json({ success: false, message: "Une erreur est survenue", error });
    }
};

/**
 * @desc Obtenir les avis d'un élément spécifique (cours, leçon ou exercice)
 * @route GET /api/avis/item/:itemId
 */
export const getAvisByItem = async (req: Request, res: Response) => {
    try {
        const avis = await Avis.find({ item_id: req.params.itemId });

        res.status(200).json({ success: true, data: avis });
    } catch (error) {
        res.status(500).json({ success: false, message: "Une erreur est survenue", error});
    }
};

/**
 * @desc Obtenir les réponses d'un avis spécifique
 * @route GET /api/avis/:id/responses
 */
export const getResponsesByAvis = async (req: Request, res: Response) => {
    try {
        const responses = await Avis.find({ avis_parent_id: req.params.id });

        res.status(200).json({ success: true, data: responses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Une erreur est survenue", error });
    }
};

/**
 * @desc Mettre à jour un avis
 * @route PUT /api/avis/:id
 */
export const updateAvis = async (req: Request, res: Response) => {
    try {
        const updatedAvis = await Avis.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedAvis) {
            return res.status(404).json({ success: false, message: "Avis non trouvé" });
        }

        res.status(200).json({ success: true, data: updatedAvis });
    } catch (error) {
        res.status(500).json({ success: false, message: "Une erreur est survenue", error });
    }
};

/**
 * @desc Supprimer un avis
 * @route DELETE /api/avis/:id
 */
export const deleteAvis = async (req: Request, res: Response) => {
    try {
        const deletedAvis = await Avis.findByIdAndDelete(req.params.id);

        if (!deletedAvis) {
            return res.status(404).json({ success: false, message: "Avis non trouvé" });
        }

        res.status(200).json({ success: true, message: "Avis supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Une erreur est survenue", error });
    }
};

/**
 * @desc Filtrer les avis par type (cours, leçon ou exercice)
 * @route GET /api/avis/filter
 */
export const filterAvisByType = async (req: Request, res: Response) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({ success: false, message: "Type de filtre manquant" });
        }

        const avis = await Avis.find({ type });

        res.status(200).json({ success: true, data: avis });
    } catch (error) {
        res.status(500).json({ success: false, message: "Une erreur est survenue", error });
    }
};

export const getCommentsByProfessor = async (req: Request, res: Response) => {
    try {
        const { professorId } = req.params;

        if (!professorId) {
            return res.status(400).json({ error: "Le professeur ID est requis." });
        }

        // Récupérer les cours créés par le professeur
        const courses = await Course.find({ created_by: professorId });

        if (courses.length === 0) {
            return res.status(404).json({ message: "Aucun cours trouvé pour ce professeur." });
        }

        // Extraire les IDs des cours
        const courseIds = courses.map(course => course._id);

        // Récupérer les commentaires liés aux cours
        const avis = await Avis.find({
            item_id: { $in: courseIds },
            type: "course"
        })
            .populate("user_id", "firstname lastname username email") // Peupler les infos utilisateur
            .populate("item_id", "title description") // Peupler les infos du cours
            .populate("avis_parent_id"); // Peupler les infos du commentaire parent

        if (avis.length === 0) {
            return res.status(201).json({ message: "Aucun commentaire trouvé pour ces cours." });
        }

        // Retourner les commentaires
        res.status(200).json({ avis });
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const getRepliesForAvis = async (req: Request, res: Response) => {
    try {
        const { avisId } = req.params;

        if (!avisId) {
            return res.status(400).json({ error: "L'ID de l'avis parent est requis." });
        }

        // Récupérer les réponses à un commentaire
        const replies = await Avis.find({ avis_parent_id: avisId })
            .populate("user_id", "firstname lastname username email") // Peupler les infos utilisateur
            .populate("item_id", "title description") // Peupler les infos du cours
            .populate("avis_parent_id"); // Peupler les infos du commentaire parent

        if (replies.length === 0) {
            return res.status(201).json({ message: "Aucune réponse trouvée pour cet avis." });
        }

        // Retourner les réponses trouvées
        res.status(200).json({ replies });
    } catch (error) {
        console.error("Erreur lors de la récupération des réponses :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};
