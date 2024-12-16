import { Request, Response } from "express";
import Course from "../models/Course";

export const getAllCourse = async (req: Request, res: Response) => {
    try {
        const totalCourses = await Course.countDocuments(); // Compter les cours
        const courses = await Course.find()
            .populate("created_by")
            .populate("studyLevel_id")
            .populate("job_id")
            .populate("category_id");
        res.status(200).json({
            total: totalCourses,
            data: courses,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des cours" });
        console.error(error);
    }
};


export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, description, price, isCertified, created_by, studyLevel_id, job_id, category_id } = req.body;


        const image = req.file ? `/uploads/${req.file.filename}` : "";
        const path_image = `${req.protocol}://${req.get("host")}${image}`;

        const video = req.file ? `/uploads/${req.file.filename}` : "";
        const path_video = `${req.protocol}://${req.get("host")}${video}`;

        // Créer le cours
        const newCourse = new Course({
            title,
            description,
            path_image,
            path_video,
            price,
            isCertified,
            created_by,
            studyLevel_id,
            job_id,
            category_id,
        });

        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création du cours", error });
    }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedcourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedcourse) {
            res.status(404).json({ message: "cours non trouvé" });
            return;
        }
        res.status(200).json(updatedcourse);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour du cours", error });
    }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Récupération de l'ID depuis les paramètres de la requête
        const deletedcourse = await Course.findByIdAndDelete(id);

        if (!deletedcourse) {
            res.status(404).json({ message: "cours non trouvé" });
            return;
        }

        res.status(200).json({ message: "cours supprimé avec succès" });
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la suppression du cours", error });
    }
};

// Obtenir un cours par ID
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findById(req.params.id).populate("created_by").populate("studyLevel_id").populate("job_id").populate("category_id");
        if (!course) {
            res.status(404).json({ message: "cours non trouvée" });
            return;
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la récupération du cours", error });
    }
};