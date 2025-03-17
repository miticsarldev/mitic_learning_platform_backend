import { Request, Response } from "express";
import Progress from "../models/Progress";
import Lessons from "../models/Lessons";
import Course from "../models/Course";

//  Créer une progression pour un étudiant quand il commence un cours
export const createProgress = async (req: Request, res: Response) => {
    try {
        const { user_id, course_id } = req.body;

        // Vérifier si le cours existe
        const courseExists = await Course.findById(course_id);
        if (!courseExists) {
            return res.status(404).json({ message: "Cours introuvable" });
        }

        // Trouver la première leçon du cours
        const firstLesson = await Lessons.findOne({ course_id }).sort({ order: 1 });

        if (!firstLesson) {
            return res.status(400).json({ message: "Ce cours n'a aucune leçon." });
        }

        // Vérifier si une progression existe déjà
        const existingProgress = await Progress.findOne({ user_id, course_id });

        if (existingProgress) {
            return res.status(400).json({ message: "Progression déjà existante pour ce cours." });
        }

        // Créer la progression
        const progress = new Progress({
            user_id,
            course_id,
            current_lesson_id: firstLesson._id,
            progress_percentage: 0,
            status: "in_progress"
        });

        await progress.save();
        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//  Mettre à jour la progression (changer de leçon et recalculer le %)
export const updateProgress = async (req: Request, res: Response) => {
    try {
        const { user_id, course_id, current_lesson_id } = req.body;

        // Vérifier si la progression existe
        const progress = await Progress.findOne({ user_id, course_id });

        if (!progress) {
            return res.status(404).json({ message: "Progression introuvable" });
        }

        // Vérifier si la nouvelle leçon appartient bien au cours
        const lessonExists = await Lessons.findOne({ _id: current_lesson_id, course_id });

        if (!lessonExists) {
            return res.status(400).json({ message: "Leçon invalide pour ce cours." });
        }

        // Récupérer le nombre total de leçons du cours
        const totalLessons = await Lessons.countDocuments({ course_id });

        // Trouver la position de la nouvelle leçon dans le cours
        const completedLessons = await Lessons.countDocuments({
            course_id,
            _id: { $lte: current_lesson_id }
        });

        // Calculer le pourcentage de progression
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

        // Vérifier si le cours est terminé
        const status = progressPercentage === 100 ? "completed" : "in_progress";

        // Mettre à jour la progression
        progress.current_lesson_id = current_lesson_id;
        progress.progress_percentage = progressPercentage;
        progress.status = status;

        await progress.save();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//  Récupérer la progression d'un étudiant pour un cours
export const getProgressByCourse = async (req: Request, res: Response) => {
    try {
        const { user_id, course_id } = req.params;

        const progress = await Progress.findOne({ user_id, course_id })
            .populate("current_lesson_id", "title order")
            .populate("course_id", "title");

        if (!progress) {
            return res.status(404).json({ message: "Progression introuvable" });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//  Récupérer toutes les progressions d'un étudiant
export const getAllProgressForUser = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        const progressList = await Progress.find({ user_id })
            .populate("course_id", "title")
            .populate("current_lesson_id", "title order");

        res.json(progressList);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//  Supprimer une progression (ex: si l'étudiant quitte un cours)
export const deleteProgress = async (req: Request, res: Response) => {
    try {
        const { user_id, course_id } = req.params;

        const deletedProgress = await Progress.findOneAndDelete({ user_id, course_id });

        if (!deletedProgress) {
            return res.status(404).json({ message: "Progression introuvable" });
        }

        res.json({ message: "Progression supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
