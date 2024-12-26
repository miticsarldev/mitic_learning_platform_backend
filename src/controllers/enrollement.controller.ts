import { Request, Response } from "express";
import Enrollement from "../models/Enrollement";

// Créer un enrollement
export const createEnrollement = async (req: Request, res: Response) => {
    try {
        const newEnrollement = new Enrollement(req.body);
        await newEnrollement.save();
        res.status(201).json(newEnrollement);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création de l'inscription", error });
    }
};

// Obtenir toutes les inscriptions
export const getAllEnrollement = async (req: Request, res: Response) => {
    try {
        const enrollements = await Enrollement.find().populate("user_id").populate("course_id");
        res.status(200).json(enrollements);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des inscriptions", error });
    }
};

// Obtenir une inscription par ID
export const getEnrollementById = async (req: Request, res: Response): Promise<void> => {
    try {
        const enrollement = await Enrollement.findById(req.params.id);
        if (!enrollement) {
            res.status(404).json({ message: "inscription non trouvée" });
            return;
        }
        res.status(200).json(enrollement);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la récupération de l'inscription", error });
    }
};

// Mettre à jour une inscription
export const updateEnrollement = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedEnrollement = await Enrollement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEnrollement) {
            res.status(404).json({ message: "inscription non trouvée" });
            return;
        }
        res.status(200).json(updatedEnrollement);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour de l'inscription", error });
    }
};

// Supprimer une catégorie
export const deleteEnrollement = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedEnrollement = await Enrollement.findByIdAndDelete(req.params.id);
        if (!deletedEnrollement) {
            res.status(404).json({ message: "inscription non trouvée" });
            return;
        }
        res.status(200).json({ message: "inscription supprimée avec succès" });
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la suppression de l'inscription", error });
    }
};
