import { Request, Response } from "express";
import Lessons from "../models/Lessons";

// 1. Créer une nouvelle leçon
export const createLesson = async (req: Request, res: Response) => {
    try {
        const lesson = new Lessons(req.body);
        const savedLesson = await lesson.save();
        res.status(201).json(savedLesson);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création de la leçon", error });
    }
};

// 2. Récupérer toutes les leçons
export const getAllLessons = async (req: Request, res: Response) => {
    try {
        const lessons = await Lessons.find().populate("course_id");
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des leçons", error });
    }
};

// 3. Récupérer une leçon par ID
export const getLessonById = async (req: Request, res: Response) => {
    try {
        const lesson = await Lessons.findById(req.params.id).populate("course_id");
        if (!lesson) return res.status(404).json({ message: "Leçon non trouvée" });
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la leçon", error });
    }
};

// 4. Mettre à jour une leçon par ID
export const updateLesson = async (req: Request, res: Response) => {
    try {
        const updatedLesson = await Lessons.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLesson) return res.status(404).json({ message: "Leçon non trouvée" });
        res.status(200).json(updatedLesson);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la leçon", error });
    }
};

// 5. Supprimer une leçon par ID
export const deleteLesson = async (req: Request, res: Response) => {
    try {
        const deletedLesson = await Lessons.findByIdAndDelete(req.params.id);
        if (!deletedLesson) return res.status(404).json({ message: "Leçon non trouvée" });
        res.status(200).json({ message: "Leçon supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la leçon", error });
    }
};

// 6. Récupérer les leçons d'un cours spécifique
export const getLessonsByCourseId = async (req: Request, res: Response) => {
    try {
        const lessons = await Lessons.find({ course_id: req.params.course_id }).populate("course_id");
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des leçons du cours", error });
    }
};

// 7. Récupérer une leçon par ordre dans un cours
export const getLessonByOrder = async (req: Request, res: Response) => {
    try {
        const { course_id, order } = req.query;
        const lesson = await Lessons.findOne({ course_id, order }).populate("course_id");
        if (!lesson) return res.status(404).json({ message: "Leçon non trouvée pour cet ordre" });
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la leçon", error });
    }
};

// 8. Filtrer les leçons par titre et description
export const filterLessons = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.query;
        const query: any = {};
        if (title) query.title = { $regex: title, $options: "i" };
        if (description) query.description = { $regex: description, $options: "i" };
        const lessons = await Lessons.find(query).populate("course_id")
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du filtrage des leçons", error });
    }
};

// 9. Pagination pour les leçons
export const getLessonsWithPagination = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const lessons = await Lessons.find().populate("course_id")
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la pagination des leçons", error });
    }
};

// 10. Statistiques sur les leçons
export const getLessonStats = async (req: Request, res: Response) => {
    try {
        const totalLessons = await Lessons.countDocuments();
        res.status(200).json({ totalLessons });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error });
    }
};

// 11. Rechercher des leçons par mots-clés
export const searchLessons = async (req: Request, res: Response) => {
    try {
        const { keyword } = req.query;
        const lessons = await Lessons.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        }).populate("course_id");
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la recherche des leçons", error });
    }
};
