import { Schema, model } from "mongoose";
import { IUser } from "../types/model.user.type";


const UserSchema: Schema = new Schema<IUser>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ["admin", "student", "teacher"], required: true },
        dateOfBirth: { type: Date },
        phone: { type: String, required: true, unique: true },
        address: { type: String },
        studyLevel: { type: Schema.Types.ObjectId, ref: "StudyLevel" },
    },
    { timestamps: true }
);


const User = model<IUser>("User", UserSchema);
export default User;
