import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User"; // Importer le modèle User
import { IUser } from "../types/model.user.type";
import { generateAccessToken, generateRefreshToken } from "../utils";
import jwt from "jsonwebtoken";

/**
 * Créer un nouvel utilisateur.
 * @param {IUser} userData - Les données de l'utilisateur à créer.
 * @returns {Promise<IUser>} - L'utilisateur créé.
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { firstname, lastname, username, password, email, phone, role, dateOfBirth, address, studyLevel } = req.body;

        // Vérifier si tous les champs obligatoires sont présents
        if (!firstname || !lastname || !username || !password || !email || !phone || !role) {
            return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis." });
        }

        // Vérification du rôle
        if (role !== "student" && role !== "teacher" && role !== "admin") {
            return res.status(400).json({ message: "Rôle invalide." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const newUser = new User({
            firstname,
            lastname,
            username,
            password: hashedPassword,
            email,
            phone,
            role,
            dateOfBirth,
            address,
            studyLevel,
        });

        // Sauvegarde de l'utilisateur
        await newUser.save();

        // Réponse
        res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });

    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        res.status(500).json({ message: `Erreur interne du serveur : ${error}` });
    }
};

/**
 * Récupérer un utilisateur par son ID.
 * @param {string} userId - L'ID de l'utilisateur.
 * @returns {Promise<IUser | null>} - L'utilisateur correspondant ou null s'il n'existe pas.
 */
export const getUserById = async (userId: string): Promise<IUser | null> => {
    try {
        return await User.findById(userId).populate("studyLevel").exec();
    } catch (error: any) {
        throw new Error(`Erreur lors de la récupération de l'utilisateur : ${error}`);
    }
};

/**
 * Mettre à jour les informations d'un utilisateur.
 * @param {string} userId - L'ID de l'utilisateur à mettre à jour.
 * @param {Partial<IUser>} updateData - Les nouvelles données à appliquer.
 * @returns {Promise<IUser | null>} - L'utilisateur mis à jour ou null s'il n'existe pas.
 */
export const updateUser = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    try {
        if (updateData.password) {
            // Hash du nouveau mot de passe si fourni
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }
        return await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    } catch (error: any) {
        throw new Error(`Erreur lors de la mise à jour de l'utilisateur : ${error}`);
    }
};

/**
 * Supprimer un utilisateur par son ID.
 * @param {string} userId - L'ID de l'utilisateur à supprimer.
 * @returns {Promise<IUser | null>} - L'utilisateur supprimé ou null s'il n'existe pas.
 */
export const deleteUser = async (userId: string): Promise<IUser | null> => {
    try {
        return await User.findByIdAndDelete(userId).exec();
    } catch (error: any) {
        throw new Error(`Erreur lors de la suppression de l'utilisateur : ${error}`);
    }
};



export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, phone, username, password } = req.body;

        // Vérifier qu'au moins un identifiant est fourni
        if (!email && !phone && !username) {
            return res.status(400).json({
                message: "Veuillez fournir un email, un numéro de téléphone ou un nom d'utilisateur.",
            });
        }

        // Trouver l'utilisateur correspondant
        const user = await User.findOne({
            $or: [{ email }, { phone }, { username }],
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Identifiants incorrects." });
        }

        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Identifiants incorrects." });
        }

        // Générer les jetons JWT
        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);

        // Mettre à jour le dernier accès de l'utilisateur
        user.lastLogin = new Date();
        await user.save();

        // Ajouter le refresh token dans un cookie sécurisé
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Utilisez `secure: true` en production avec HTTPS
            sameSite: "strict",
        });

        // Retourner l'utilisateur et l'access token
        return res.json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                lastLogin: user.lastLogin,
            },
            accessToken,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Erreur interne du serveur.",
        });
    }
};


/**
 * Récupérer une liste d'utilisateurs par rôle.
 * @param {string} role - Le rôle des utilisateurs à rechercher (admin, student, teacher).
 * @returns {Promise<IUser[]>} - Une liste d'utilisateurs correspondant au rôle.
 */
export const getUsersByRole = async (role: string): Promise<IUser[]> => {
    try {
        return await User.find({ role }).exec();
    } catch (error: any) {
        throw new Error(`Erreur lors de la récupération des utilisateurs par rôle : ${error.message}`);
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token not provided" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as { email: string };

        const { email } = decoded;

        const accessToken = generateAccessToken(email);

        // Fetch the user from the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not authorized" });
        }

        const userObject = user.toObject();

        res.json({ user: userObject, accessToken });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

// Contrôleur pour récupérer tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Récupérer les utilisateurs en peuplant le champ `studyLevel`
        const users = await User.find().populate("studyLevel");

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur.",
        });
    }
};