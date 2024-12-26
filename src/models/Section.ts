import { Schema, model, Document } from "mongoose";
import { ISection } from "../types/model.section.type";


// Schéma Mongoose pour le modèle Section
const SectionSchema: Schema<ISection> = new Schema<ISection>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        lesson_id: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
        path_image: { type: String, default: null },
        path_video: { type: String, default: null },
        type: { type: String, required: true, enum: ["cours", "exercice"] },
        order: { type: String, required: true },
    },
    { timestamps: true } // Ajoute createdAt et updatedAt
);

// Création du modèle Section basé sur le schéma
const Section = model<ISection>("Section", SectionSchema);
export default Section;
