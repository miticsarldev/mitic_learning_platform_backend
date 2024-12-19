import { Request, Response } from "express";
import Section from "../models/Section";

// Créer une nouvelle section
export const createSection = async (req: Request, res: Response) => {
    try {
        const { title, description, lesson_id, path_image, path_video, type, order } = req.body;

        const section = await Section.create({
            title,
            description,
            lesson_id,
            path_image,
            path_video,
            type,
            order,
        });

        res.status(201).json({
            success: true,
            message: "Section created successfully",
            data: section,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create section", error });
    }
};

// Récupérer toutes les sections d'une leçon spécifique
export const getSectionsByLesson = async (req: Request, res: Response) => {
    try {
        const { lesson_id } = req.params;

        const sections = await Section.find({ lesson_id }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            data: sections,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch sections", error });
    }
};

// Récupérer une section par ID
export const getSectionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const section = await Section.findById(id);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        res.status(200).json({
            success: true,
            data: section,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch section", error });
    }
};

// Mettre à jour une section
export const updateSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedSection = await Section.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update section", error });
    }
};

// Supprimer une section
export const deleteSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedSection = await Section.findByIdAndDelete(id);

        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete section", error });
    }
};

// Récupérer toutes les sections
export const getAllSections = async (_req: Request, res: Response) => {
    try {
        const sections = await Section.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: sections,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch sections", error });
    }
};

// Réordonner les sections d'une leçon
export const reorderSections = async (req: Request, res: Response) => {
    try {
        const { lesson_id } = req.params;
        const { newOrder } = req.body; // Un tableau contenant les IDs des sections dans le nouvel ordre

        for (let i = 0; i < newOrder.length; i++) {
            await Section.findByIdAndUpdate(newOrder[i], { order: i + 1 });
        }

        res.status(200).json({
            success: true,
            message: "Sections reordered successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to reorder sections", error });
    }
};

// Rechercher des sections par titre ou description
export const searchSections = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        const sections = await Section.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ],
        });

        res.status(200).json({
            success: true,
            data: sections,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to search sections", error });
    }
};
