import { Document, Schema } from "mongoose";

export interface IJob extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    description?: string;
}
