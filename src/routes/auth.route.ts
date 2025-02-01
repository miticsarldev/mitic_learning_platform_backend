import { Router } from "express";
import { validateUser } from "../middlewares/validateUser";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUsersByRole,
  login,
  logout,
  refreshToken,
  register,
  toggleUserStatus,
  updateUser,
  verifyOTP,
} from "../controllers/auth.controller";

const router = Router();

// Registration
router.post("/register", validateUser, register);

router.post("/verify-otp", verifyOTP);


// Login
router.post("/login", login);

// Refresh token
router.post("/refresh", refreshToken);

// Logout
router.post("/logout", logout);

// Route pour mettre à jour un utilisateur par ID
router.put('/users/:id', updateUser);

// Delete user
router.delete("/users/:id", deleteUser);

// Route pour récupérer tous les utilisateurs
router.get("/users", getAllUsers);


router.patch("/users/:id/toggle-status", toggleUserStatus);

router.get("/users/id/:id", getUserById);   // Route pour obtenir un utilisateur par ID

router.get("/users/role/:role", getUsersByRole); // Route pour obtenir les utilisateurs par rôle


export default router;
