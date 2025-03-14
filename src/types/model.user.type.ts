import { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    bio: string;
    role: "admin" | "student" | "teacher";
    dateOfBirth?: Date;
    phone: string;
    address?: string;
    studyLevel?:  Schema.Types.ObjectId;
    lastLogin: Date;
    status: boolean;
    isVerified: boolean;
    otp: string | undefined;
    otpExpires: Date | undefined;
}
