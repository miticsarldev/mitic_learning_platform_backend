import { Document, Schema } from "mongoose";

export interface IStudyLevel extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    description?: string;
}
