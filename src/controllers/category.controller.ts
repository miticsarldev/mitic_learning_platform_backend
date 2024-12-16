import { Request, Response } from "express";
import Category from "../models/Category";

// Créer une catégorie
export const createCategory = async (req: Request, res: Response) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création de la catégorie", error });
    }
};

// Obtenir toutes les catégories
export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des catégories", error });
    }
};

// Obtenir une catégorie par ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return; 
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la récupération de la catégorie", error });
    }
};

// Mettre à jour une catégorie
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return;
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour de la catégorie", error });
    }
};

// Supprimer une catégorie
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            res.status(404).json({ message: "Catégorie non trouvée" });
            return; 
        }
        res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la suppression de la catégorie", error });
    }
};
