import { Schema, model } from "mongoose";
import { IUser } from "../types/model.user.type";


const UserSchema: Schema = new Schema<IUser>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        bio: { type: String },
        role: { type: String, enum: ["admin", "student", "teacher"], required: true },
        dateOfBirth: { type: Date },
        phone: { type: String, required: true, unique: true },
        address: { type: String },
        studyLevel: { type: Schema.Types.ObjectId, ref: "StudyLevel" },
        status: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        otp: { type: String },
        otpExpires: { type: Date },
    },
    { timestamps: true }
);


const User = model<IUser>("User", UserSchema);
export default User;
