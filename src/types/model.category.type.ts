import { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    description?: string;
}
