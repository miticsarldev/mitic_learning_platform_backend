import { Router } from "express";
import { createEnrollement, deleteEnrollement, getAllEnrollement, getEnrollementById, updateEnrollement } from "../controllers/enrollement.controller";

const router = Router();

// creer un enrollement
router.post("/enrollement", createEnrollement);

// recuperer tous les enrollement 
router.post("/enrollement", getAllEnrollement);

// recuperer un enrollement par son id
router.post("/enrollement/:id", getEnrollementById);

// modifier enrollement
router.post("/enrollement/:id", updateEnrollement);


// Route pour mettre à jour un enrollement par ID
router.put('/enrollement/:id', deleteEnrollement);


export default router;
