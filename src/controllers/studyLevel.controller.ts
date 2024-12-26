import { Request, Response } from "express";
import StudyLevel from "../models/StudyLevel";

// Get all StudyLevels
export const getAllStudyLevels = async (req: Request, res: Response) => {
    try {
        const StudyLevels = await StudyLevel.find();
        res.status(200).json(StudyLevels);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des niveaux", error });
    }
};

// Create a new StudyLevel
export const createStudyLevel = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const newStudyLevel = new StudyLevel({ name, description });
        await newStudyLevel.save();
        res.status(201).json(newStudyLevel);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création du niveau", error });
    }
};

// Update a StudyLevel
export const updateStudyLevel = async (req: Request, res: Response): Promise<void> => {
    try {
        const StudyLevelId = req.params.id;
        const updatedStudyLevel = await StudyLevel.findByIdAndUpdate(StudyLevelId, req.body, { new: true });

        if (!updatedStudyLevel) {
            res.status(404).json({ message: "StudyLevel non trouvé" });
            return;
        }

        res.status(200).json(updatedStudyLevel);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour du niveau", error });
    }
};

// Delete a StudyLevel
export const deleteStudyLevel = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedStudyLevel = await StudyLevel.findByIdAndDelete(id);

        if (!deletedStudyLevel) {
            res.status(404).json({ message: "StudyLevel non trouvé" });
            return;
        }

        res.status(200).json({ message: "Niveau supprimé avec succès" });
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la suppression du niveau", error });
    }
};
