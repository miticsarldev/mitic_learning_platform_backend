import express from "express";
import { createJob, deleteJob, getAllJob, getJobById, updateJob } from "../controllers/job.controller";


const router = express.Router();

// Route pour créer un job
router.post("/job", createJob);

// Route pour obtenir tous les job
router.get("/job", getAllJob);

// Route pour obtenir une job par ID
router.get("/job/:id", getJobById);

// Route pour mettre à jour une job
router.put("/job/:id", updateJob);

// Route pour supprimer une job
router.delete("/job/:id", deleteJob);

export default router;
