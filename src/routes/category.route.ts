import express from "express";
import {
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllCategory,
} from "../controllers/category.controller";

const router = express.Router();

// Route pour créer une catégorie
router.post("/category", createCategory);

// Route pour obtenir toutes les catégories
router.get("/category", getAllCategory);

// Route pour obtenir une catégorie par ID
router.get("/category/:id", getCategoryById);

// Route pour mettre à jour une catégorie
router.put("/category/:id", updateCategory);

// Route pour supprimer une catégorie
router.delete("/category/:id", deleteCategory);

export default router;
