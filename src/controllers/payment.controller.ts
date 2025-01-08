import { Request, Response } from "express";
import Payment from "../models/Payment";
import User from "../models/User";
import Course from "../models/Course";
import Enrollement from "../models/Enrollement";
import mongoose from "mongoose";

/**
 * @desc Créer un nouveau paiement
 * @route POST /api/payments
 */
export const createPayment = async (req: Request, res: Response) => {
    try {
        const { user_id, course_id, enrollement_id, totaAmount, paymentDate, status } = req.body;

        const newPayment = new Payment({
            user_id,
            course_id,
            enrollement_id,
            totaAmount,
            paymentDate,
            status
        });

        await newPayment.save();
        return res.status(201).json({ success: true, data: newPayment });
    } catch (error) {
        return res.status(500).json({ success: false, message: "impossible d'ajoputer le payment" });
    }
};

/**
 * @desc Récupérer tous les paiements
 * @route GET /api/payments
 */
export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const payments = await Payment.find().populate("user_id").populate("course_id").populate("enrollement_id");
        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "impossible de recuperer les payements" });
    }
};

/**
 * @desc Récupérer un paiement par ID
 * @route GET /api/payments/:id
 */
export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id).populate("user_id").populate("course_id").populate("enrollement_id");

        if (!payment) {
            return res.status(404).json({ success: false, message: "Paiement non trouvé" });
        }

        return res.status(200).json({ success: true, data: payment });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Une erreur est survenue veuillez reessayer" });
    }
};

/**
 * @desc Mettre à jour un paiement
 * @route PUT /api/payments/:id
 */
export const updatePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedPayment = await Payment.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPayment) {
            return res.status(404).json({ success: false, message: "Paiement non trouvé" });
        }

        return res.status(200).json({ success: true, data: updatedPayment });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Impossible de mettre a jour le payment" });
    }
};

/**
 * @desc Supprimer un paiement
 * @route DELETE /api/payments/:id
 */
export const deletePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedPayment = await Payment.findByIdAndDelete(id);

        if (!deletedPayment) {
            return res.status(404).json({ success: false, message: "Paiement non trouvé" });
        }

        return res.status(200).json({ success: true, message: "Paiement supprimé avec succès" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Impossible de supprimer le payment" });
    }
};

/**
 * @desc Filtrer les paiements par query params (user, course, status)
 * @route GET /api/payments/filter
 */
export const filterPayments = async (req: Request, res: Response) => {
    try {
        const { user_id, course_id, status } = req.query;
        const query: any = {};

        if (user_id) query.user_id = user_id;
        if (course_id) query.course_id = course_id;
        if (status) query.status = status;

        const payments = await Payment.find(query).populate("user_id").populate("course_id").populate("enrollement_id");
        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Impossible d'appliquer les filtres" });
    }
};

/**
 * @desc Obtenir les statistiques des paiements
 * @route GET /api/payments/stats
 */
export const getPaymentStats = async (req: Request, res: Response) => {
    try {
        const stats = await Payment.aggregate([
            {
                $group: {
                    _id: "$status",
                    totalAmount: { $sum: "$totaAmount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({ success: true, data: stats });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Impossible de recuperer les statistiques" });
    }
};


// Fonction pour récupérer les paiements liés aux cours d'un professeur
export const getPaymentsByTeacher = async (req: Request, res: Response) => {
    try {
        // Récupération de l'ID du professeur depuis les paramètres de la requête
        const { teacherId } = req.params;

        // Vérification que l'ID est valide
        if (!teacherId) {
            return res.status(400).json({ message: "L'ID du professeur est requis." });
        }

        // Trouver les cours créés par ce professeur
        const courses = await Course.find({ created_by: teacherId });

        if (courses.length === 0) {
            return res.status(404).json({ message: "Aucun cours trouvé pour ce professeur." });
        }

        // Récupérer les IDs des cours
        const courseIds = courses.map(course => course._id);

        // Trouver les paiements liés à ces cours
        const payments = await Payment.find({ course_id: { $in: courseIds } })
            .populate({ path: "user_id", select: "firstname lastname email phone" }) // Informations de l'utilisateur
            .populate({ path: "course_id", select: "title description price" })       // Informations sur le cours
            .populate({ path: "enrollement_id", select: "start_date status completion_date" }); // Informations sur l'inscription

        // Vérifier s'il y a des paiements
        if (payments.length === 0) {
            return res.status(404).json({ message: "Aucun paiement trouvé pour les cours de ce professeur." });
        }

        // Retourner les paiements avec les informations demandées
        return res.status(200).json({
            payments: payments
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

// Fonction pour obtenir les paiements totaux par année pour les cours d'un professeur
export const getTotalPaymentsByYear = async (req: Request, res: Response) => {
    try {
        const { teacherId } = req.params;

        // Vérification si l'utilisateur est bien un professeur
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== "teacher") {
            return res.status(404).json({ message: "Teacher not found or invalid role" });
        }

        // Récupérer tous les cours du professeur
        const courses = await Course.find({ created_by: teacherId });

        if (!courses.length) {
            return res.status(404).json({ message: "No courses found for this teacher" });
        }

        // Récupérer les paiements pour ces cours
        const payments = await Payment.aggregate([
            {
                $match: {
                    course_id: { $in: courses.map(course => course._id) },
                },
            },
            {
                $group: {
                    _id: { $year: "$paymentDate" },  // Regrouper par année
                    totalAmount: { $sum: "$totaAmount" },  // Calculer le total par année
                },
            },
            {
                $sort: { _id: 1 },  // Trier par année croissante
            },
        ]);

        // Retourner les résultats
        return res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getMonthlyEarningsByTeacher = async (req: Request, res: Response) => {
    try {
        const { teacherId, year } = req.params;

        // Vérifications des paramètres
        if (!teacherId || !year) {
            return res.status(400).json({ message: "teacherId and year are required." });
        }

        // Convertir l'année en Date pour les filtres
        const startOfYear = new Date(`${year}-01-01`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

        // Pipeline d'agrégation
        const payments = await Payment.aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "course",
                },
            },
            { $unwind: "$course" },
            {
                $match: {
                    "course.created_by": new mongoose.Types.ObjectId(teacherId),
                    paymentDate: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                    status: "success",
                },
            },
            {
                $group: {
                    _id: { $month: "$paymentDate" },
                    totalAmount: { $sum: "$totaAmount" },
                },
            },
            {
                $sort: { "_id": 1 },
            },
        ]);


        // Préparer les données pour tous les mois
        const months = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
        ];
        const monthlyData = months.map((month, index) => {
            const payment = payments.find((p) => p._id === index + 1);
            return {
                mois: month,
                total: payment ? payment.totalAmount : 0,
            };
        });

        // Réponse
        res.status(200).json(monthlyData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
