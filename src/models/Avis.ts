import { Schema, model, Document } from "mongoose";
import { IAvis } from "../types/model.avis.type";

const AvisSchema: Schema = new Schema<IAvis>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" }, //utilisateur ayant fait le commentaire
        content: { type: String, required: true }, //contenue du commentaire
        type: { type: String, enum: ["course", "lesson", "exercise"], required: true },//type de l'element commenter
        item_id: { type: Schema.Types.ObjectId, required: true, ref: "Course" },//id de l'element commenter
        avis_parent_id: { type: Schema.Types.ObjectId, ref: "Avis", default: null },//id du commentaire parent si il s'agit d'une reponse a un commentaire
    },
    { timestamps: true }
);

const Avis = model<IAvis>("Avis", AvisSchema);
export default Avis;
