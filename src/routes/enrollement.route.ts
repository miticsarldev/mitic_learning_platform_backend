import { Router } from "express";
import { createEnrollement, deleteEnrollement, getAllEnrollement, getEnrollementById, getStudentsByTeacher, updateEnrollement, getEnrollmentProgress, getEnrollmentsByTeacher } from '../controllers/enrollement.controller';

const router = Router();

// creer un enrollement
router.post("/enrollement", createEnrollement);

// recuperer tous les enrollement 
router.get("/enrollement", getAllEnrollement);

// recuperer un enrollement par son id
router.get("/enrollement/:id", getEnrollementById);

// modifier enrollement
router.put("/enrollement/:id", updateEnrollement);


// Route pour  supprimer un enrollement par ID
router.delete('/enrollement/:id', deleteEnrollement);

//routes pour les etudiants d'un prof
router.get("/students-by-teacher/:teacherId", getStudentsByTeacher);

router.get('/enrollment/progress/:userId/:period', getEnrollmentProgress);

// Route pour récupérer les inscriptions d'un professeur
router.get('/enrolment/teacher/:teacherId', getEnrollmentsByTeacher);


export default router;
