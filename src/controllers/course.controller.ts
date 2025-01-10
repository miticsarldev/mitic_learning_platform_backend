import { Request, Response } from "express";
import Course from "../models/Course";
import multer, { MulterError } from "multer";
import Lessons from "../models/Lessons";
import Section from "../models/Section";
import User from "../models/User";
import Enrollement from "../models/Enrollement";

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

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({ storage }).fields([
    { name: "path_image", maxCount: 1 },
    { name: "path_video", maxCount: 1 },
]);

// Ajoutez un type pour req.files
interface MulterRequest extends Request {
    files: {
        [fieldname: string]: Express.Multer.File[];
    };
}

// Fonction pour créer un cours avec ses leçons et sections
export const createCourseWithLessonsAndSections = async (req: Request, res: Response) => {
    upload(req, res, async (err: any) => {
        if (err) {
            return res.status(400).json({ error: "Erreur lors du téléchargement des fichiers", details: err.message });
        }

        try {
            const {
                title,
                description,
                price,
                isCertified,
                duration,
                created_by,
                studyLevel_id,
                job_id,
                category_id,
            } = req.body;

            const multerReq = req as MulterRequest;

            // Ajouter le cours
            const courseData = {
                title,
                description,
                price,
                isCertified,
                duration,
                created_by,
                studyLevel_id,
                job_id,
                category_id,
                path_image: multerReq.files?.["path_image"]
                    ? `/uploads/${multerReq.files["path_image"][0].filename}`
                    : null,
                path_video: multerReq.files?.["path_video"]
                    ? `/uploads/${multerReq.files["path_video"][0].filename}`
                    : null,
            };

            const course = new Course(courseData);
            await course.save();

            // Traiter les leçons
            const lessons = typeof req.body.lessons === "string" ? JSON.parse(req.body.lessons) : req.body.lessons;

            for (const lesson of lessons) {
                const lessonData = {
                    title: lesson.title,
                    description: lesson.description,
                    duration: lesson.duration,
                    order: lesson.order,
                    course_id: course._id,
                };

                const savedLesson = new Lessons(lessonData);
                await savedLesson.save();

                for (const section of lesson.sections) {
                    const sectionData = {
                        title: section.title,
                        description: section.description,
                        lesson_id: savedLesson._id,
                        type: section.type,
                        order: section.order,
                        path_image: section.path_image ? `/uploads/${section.path_image}` : null,
                        path_video: section.path_video ? `/uploads/${section.path_video}` : null,
                    };

                    const savedSection = new Section(sectionData);
                    await savedSection.save();
                }
            }

            res.status(201).json({ message: "Cours, leçons, et sections ajoutés avec succès.", course });
        } catch (error: any) {
            res.status(500).json({ error: "Erreur lors de l'ajout du cours", details: error.message });
        }
    });
};

// Fonction pour récupérer le nombre d'inscriptions par cours pour un professeur
export const getCourseEnrollmentStats = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId; // ID du professeur qui est passé en paramètre

        // Vérification que l'utilisateur est bien un professeur
        const user = await User.findById(userId);
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({ message: 'Accès non autorisé. L\'utilisateur n\'est pas un professeur.' });
        }

        // Récupérer tous les cours créés par le professeur
        const courses = await Course.find({ created_by: userId });

        // Récupérer le nombre d'inscriptions pour chaque cours
        const courseStats = await Promise.all(
            courses.map(async (course) => {
                const enrolmentsCount = await Enrollement.countDocuments({ course_id: course._id });
                return {
                    courseTitle: course.title,
                    studentsCount: enrolmentsCount,
                };
            })
        );

        // Répondre avec les données de statistiques
        return res.status(200).json(courseStats);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques des inscriptions :', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const getCourseDetails = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params; // Récupère l'ID du cours depuis les paramètres

        // Récupère les informations du cours en populant ses clés étrangères
        const course = await Course.findById(courseId)
            .populate("created_by", "firstname lastname email") // Peuple l'utilisateur créateur
            .populate("studyLevel_id", "name") // Peuple le niveau d'étude
            .populate("job_id", "name") // Peuple le métier
            .populate("category_id", "name"); // Peuple la catégorie

        if (!course) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        // Récupère les leçons associées au cours, triées par le champ "order"
        const lessons = await Lessons.find({ course_id: courseId }).sort({ order: 1 });

        // Récupère les sections pour chaque leçon
        const lessonsWithSections = await Promise.all(
            lessons.map(async (lesson) => {
                const sections = await Section.find({ lesson_id: lesson._id }).sort({ order: 1 });
                return {
                    ...lesson.toObject(),
                    sections,
                };
            })
        );

        // Retourne les informations du cours avec les leçons et les sections
        return res.status(200).json({
            course,
            lessons: lessonsWithSections,
        });
    } catch (error: any) {
        console.error("Erreur lors de la récupération des détails du cours :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

/**
 * Récupère les cours créés par un professeur spécifique
 * @param req Request Express contenant l'ID du professeur dans `req.params`
 * @param res Response Express pour envoyer les résultats ou les erreurs
 */
export const getCoursesByTeacher = async (req: Request, res: Response) => {
    const { teacherId } = req.params; // ID du professeur passé en paramètre

    if (!teacherId) {
        return res.status(400).json({ message: "L'ID du professeur est requis." });
    }

    try {
        const courses = await Course.find({ created_by: teacherId })
            .populate("created_by", "username firstname lastname email") // Peupler le créateur (User) avec les champs `username` et `email`
            .populate("studyLevel_id", "name description") // Peupler le niveau d'étude
            .populate("job_id", "title description") // Peupler le job
            .populate("category_id", "name description") // Peupler la catégorie
            .exec();

        if (courses.length === 0) {
            return res.status(404).json({ message: "Aucun cours trouvé pour ce professeur." });
        }

        res.status(200).json({ 
            data : courses
         });
    } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
        res.status(500).json({ message: "Une erreur est survenue.", error });
    }
};