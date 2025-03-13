import { Request, Response } from "express";
import Enrollement from "../models/Enrollement";
import Course from "../models/Course";
import User from "../models/User";
import mongoose from "mongoose";
import { createProgress } from "./progress.controller";

// Créer un enrollement
export const createEnrollement = async (req: Request, res: Response) => {
  try {
    const newEnrollement = new Enrollement(req.body);
    await newEnrollement.save();
    createProgress(req, res);
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

// Supprimer une inscription
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


// Fonction pour récupérer le nombre d'inscriptions par période (semaine ou mois)
export const getEnrollmentProgress = async (req: Request, res: Response) => {
  try {
    const { userId, period } = req.params; // userId du professeur, period ('week' ou 'month')

    // Récupérer tous les cours enseignés par ce professeur
    const courses = await Course.find({ created_by: userId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'Aucun cours trouvé pour ce professeur.' });
    }

    // Définir la condition de correspondance pour la période
    let periodFormat;
    if (period === 'week') {
      periodFormat = '%Y-%U'; // Format pour récupérer l'année et la semaine
    } else if (period === 'month') {
      periodFormat = '%Y-%m'; // Format pour récupérer l'année et le mois
    }

    // Pipeline d'agrégation
    const enrollmentStats = await Enrollement.aggregate([
      {
        $match: {
          course_id: { $in: courses.map(course => course._id) },
        },
      },
      {
        $addFields: {
          period: {
            $dateToString: {
              format: periodFormat,
              date: "$start_date",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            courseId: '$course_id',
            period: '$period',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.period': 1 },
      },
    ]);

    // Organiser les données sous forme de réponse
    const courseTitles = courses.map(course => course.title);
    const seriesData = courseTitles.map(courseTitle => {
      const courseData = enrollmentStats.filter(stat => stat._id.courseId.toString() === courseTitle);  // Comparaison avec les ids des cours
      return {
        name: courseTitle,
        data: courseData.map(stat => stat.count),
      };
    });

    res.status(200).json({
      series: seriesData,
      categories: enrollmentStats.map(stat => stat._id.period),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'inscriptions :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Fonction pour récupérer les inscriptions d'un professeur avec les clés étrangères peuplées
export const getEnrollmentsByTeacher = async (req: Request, res: Response) => {
  try {
    const teacherId = req.params.teacherId; // Récupère l'ID du professeur depuis les paramètres de la requête

    // Trouver les cours associés au professeur
    const courses = await Course.find({ created_by: teacherId }).select('_id'); // Récupère les IDs des cours du professeur

    // Si aucun cours n'est trouvé, retourne une erreur
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Aucun cours trouvé pour ce professeur.' });
    }

    // Récupérer les inscriptions associées à ces cours, et peupler avec les clés étrangères
    const enrolments = await Enrollement.find({
      course_id: { $in: courses.map(course => course._id) }, // Filtrer les inscriptions en fonction des cours du professeur
    })
      .populate('user_id', 'firstname lastname email') // Peupler les informations de l'étudiant (par exemple : name, email)
      .populate('course_id', 'title description') // Peupler les informations du cours (par exemple : title, description)
      .exec();

    // Retourner les inscriptions avec les données peuplées
    return res.status(200).json({ enrolments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des inscriptions.' });
  }
};

//recuperer le nombre d'inscription d'un cours 
export const getEnrollementsCountByCourseId = async (req: Request, res: Response) => {
  try {
    // Récupérer l'ID du cours depuis les paramètres de la requête
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "L'ID du cours est requis." });
    }

    // Compter le nombre d'inscriptions pour ce cours
    const enrollementsCount = await Enrollement.countDocuments({ course_id: courseId });

    // Retourner la réponse
    return res.status(200).json({
      courseId,
      enrollementsCount,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des inscriptions :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

export const getEnrollementsByStudent = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "L'ID de l'étudiant est requis." });
    }

    const enrollements = await Enrollement.find({ user_id })
      .populate("course_id") // Récupère les infos du cours
      .exec();

    if (!enrollements.length) {
      return res.status(404).json({ message: "Aucun enrôlement trouvé pour cet étudiant." });
    }

    res.status(200).json(enrollements);
  } catch (error) {
    console.error("Erreur lors de la récupération des enrôlements :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};