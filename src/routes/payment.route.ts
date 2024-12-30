import { Router } from "express";
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    filterPayments,
    getPaymentStats,
    getPaymentsByTeacher
} from "../controllers/payment.controller";

const router = Router();

/**
 * @route POST /api/payments
 * @desc Créer un nouveau paiement
 */
router.post("/payments", createPayment);

/**
 * @route GET /api/payments
 * @desc Récupérer tous les paiements
 */
router.get("/payments", getAllPayments);

/**
 * @route GET /api/payments/:id
 * @desc Récupérer un paiement par ID
 */
router.get("/payments/:id", getPaymentById);

/**
 * @route PUT /api/payments/:id
 * @desc Mettre à jour un paiement
 */
router.put("/payments/:id", updatePayment);

/**
 * @route DELETE /api/payments/:id
 * @desc Supprimer un paiement
 */
router.delete("/payments/:id", deletePayment);

/**
 * @route GET /api/payments/filter
 * @desc Filtrer les paiements par query params
 */
router.get("/payments/filter", filterPayments);

/**
 * @route GET /api/payments/stats
 * @desc Obtenir les statistiques des paiements
 */
router.get("/payments/stats", getPaymentStats);

/**
 * @route GET /api/payments-teacher/:teacherId
 * @desc Obtenir les payements d'un prof
 */

router.get("/payments-teacher/:teacherId", getPaymentsByTeacher);

export default router;
