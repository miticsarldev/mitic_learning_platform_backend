import { Document, Schema } from "mongoose";

export interface IAvis extends Document {
    user_id: Schema.Types.ObjectId; // ID de la personne ayant fait le commentaire
    content: string; // Contenu du commentaire
    type: "course" | "lesson" | "exercise"; // Type de l'élément commenté
    item_id: Schema.Types.ObjectId; // ID de l'élément commenté
    avis_parent_id?: Schema.Types.ObjectId; // ID du commentaire parent (optionnel)
}
