import { Schema, model } from "mongoose";
import { IProgress } from "../types/model.progress.type";

const ProgressSchema: Schema = new Schema<IProgress>(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Étudiant concerné
        course_id: { type: Schema.Types.ObjectId, ref: "Course", required: true }, // Cours suivi
        current_lesson_id: { type: Schema.Types.ObjectId, ref: "Lessons", required: true }, // Dernière leçon suivie
        progress_percentage: { type: Number, min: 0, max: 100, default: 0 }, // Progression en %
        status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" }, // Statut d'avancement
    },
    { timestamps: true }
);

const Progress = model<IProgress>("Progress", ProgressSchema);
export default Progress;
