import { Schema, model, Document } from "mongoose";
import { IAvis } from "../types/model.avis.type";

const AvisSchema: Schema = new Schema<IAvis>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        content: { type: String, required: true },
        type: { type: String, enum: ["course", "lesson", "exercise"], required: true },
        item_id: { type: Schema.Types.ObjectId, required: true },
        avis_parent_id: { type: Schema.Types.ObjectId, ref: "Avis", default: null },
    },
    { timestamps: true }
);

const Avis = model<IAvis>("Avis", AvisSchema);
export default Avis;
