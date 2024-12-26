import { Request, Response } from "express";
import Job from "../models/Job";


// Créer une job
export const createJob = async (req: Request, res: Response) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création de la job", error });
    }
};

// Obtenir toutes les jobs
export const getAllJob = async (req: Request, res: Response) => {
    try {
        const job = await Job.find();
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des jobs", error });
    }
};

// Obtenir une job par ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            res.status(404).json({ message: "job non trouvée" });
            return;
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la récupération de la job", error });
    }
};

// Mettre à jour une job
export const updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) {
            res.status(404).json({ message: "job non trouvée" });
            return;
        }
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour de la job", error });
    }
};

// Supprimer une job
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            res.status(404).json({ message: "job non trouvée" });
            return;
        }
        res.status(200).json({ message: "job supprimée avec succès" });
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la suppression de la job", error });
    }
};
