import { Request, Response } from "express";
import Avis from "../models/Avis";

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
        const avis = await Avis.find();
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
        const avis = await Avis.findById(req.params.id);

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
