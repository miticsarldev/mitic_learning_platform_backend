import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import JoiPasswordComplexity, { ComplexityOptions } from "joi-password-complexity";
import { IUser } from "../types/model.user.type";

// Configuration de la complexité du mot de passe
const myComplexity: ComplexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 8,
};

// Schéma de validation de l'utilisateur
const userSchema = Joi.object<IUser>({
  firstname: Joi.string().required().messages({
    'string.base': 'Le prénom doit être une chaîne de caractères.',
    'string.empty': 'Le prénom ne peut pas être vide.',
    'any.required': 'Le prénom est requis.'
  }),
  username: Joi.string().required().messages({
    'string.base': 'Le nom d\'utilisateur doit être une chaîne de caractères.',
    'string.empty': 'Le nom d\'utilisateur ne peut pas être vide.',
    'any.required': 'Le nom d\'utilisateur est requis.'
  }),
  password: JoiPasswordComplexity(myComplexity).required().messages({
    'any.required': 'Le mot de passe est requis.',
    'string.base': 'Le mot de passe doit être une chaîne de caractères.',
    'string.empty': 'Le mot de passe ne peut pas être vide.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'L\'email doit être une adresse valide.',
    'string.empty': 'L\'email ne peut pas être vide.',
    'any.required': 'L\'email est requis.'
  }),
  role: Joi.string().valid("student", "admin", "teacher").required().messages({
    'any.only': 'Le rôle doit être l\'un des suivants : "student", "admin", "teacher".',
    'any.required': 'Le rôle est requis.'
  }),
  dateOfBirth: Joi.date().optional().messages({
    'date.base': 'La date de naissance doit être une date valide.'
  }),
  phone: Joi.string().optional().messages({
    'string.base': 'Le téléphone doit être une chaîne de caractères.'
  }),
  address: Joi.string().optional().messages({
    'string.base': 'L\'adresse doit être une chaîne de caractères.'
  }),
  studyLevel: Joi.string().optional().messages({
    'string.base': 'Le niveau d\'études doit être une chaîne de caractères.'
  })
});

// Middleware de validation
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(err => err.message);
    return res.status(400).json({ errors });
  }
  next();
};
