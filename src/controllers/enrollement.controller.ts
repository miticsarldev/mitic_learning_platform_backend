import { Request, Response } from "express";
import Enrollement from "../models/Enrollement";
import Course from "../models/Course";
import User from "../models/User";

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

//recupere les etudiant inscrit aux cours d'un prof 
export const getStudentsByTeacher = async (req: Request, res: Response) => {
    try {
        const { teacherId } = req.params;

        // Vérifier si l'enseignant existe et a le rôle "teacher"
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== "teacher") {
            return res.status(404).json({ message: "Enseignant non trouvé ou rôle invalide" });
        }

        // Récupérer tous les cours créés par l'enseignant
        const courses = await Course.find({ created_by: teacherId });
        const courseIds = courses.map((course) => course._id);

        if (courseIds.length === 0) {
            return res.status(200).json({ message: "Aucun cours créé par cet enseignant", students: [] });
        }

        // Récupérer les inscriptions aux cours créés par l'enseignant
        const enrollements = await Enrollement.find({ course_id: { $in: courseIds } })
            .populate("user_id") // Récupère les informations des étudiants
            .populate("course_id"); // Récupère les informations des cours

        // Construire la réponse
        const result = enrollements.map((enrollement) => ({
            student: enrollement.user_id, // Infos de l'étudiant
            course: enrollement.course_id, // Infos du cours
        }));

        res.status(200).json({
            teacher: {
                id: teacher._id,
                firstname: teacher.firstname,
                lastname: teacher.lastname,
            },
            students: result,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des étudiants inscrits :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
