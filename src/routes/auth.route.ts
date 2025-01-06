import { Router } from "express";
import { validateUser } from "../middlewares/validateUser";
import {
  deleteUser,
  getAllUsers,
  login,
  logout,
  refreshToken,
  register,
  updateUser,
} from "../controllers/auth.controller";

const router = Router();

// Registration
router.post("/register", validateUser, register);

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

export default router;
