import { Request, Response } from "express";
import Payment from "../models/Payment";

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
