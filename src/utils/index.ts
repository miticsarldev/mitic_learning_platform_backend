import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/model.user.type";
import nodemailer from "nodemailer";

export const generateAccessToken = (email: string) => {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (email: string) => {
  return jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Extend Express's Request interface to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as any;
    next();
  });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sidibesounk2003@gmail.com",
    pass: "hqhe name hqsk hczx",
  },
  secure: true, // Mettre true si on utilise le port 465, false sinon
  tls: {
    rejectUnauthorized: false, // Désactive la vérification SSL
  },
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: "sidibesounk2003@gmail.com",
    to: email,
    subject: "Code de vérification OTP",
    text: `Votre code OTP est : ${otp}. Il est valide pendant 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
