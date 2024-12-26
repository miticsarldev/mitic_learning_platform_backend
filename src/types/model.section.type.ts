import { Document, Schema } from "mongoose";

export interface ISection extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    description: string;
    lesson_id: Schema.Types.ObjectId;
    path_image: String;
    path_video: String;
    type: String;
    order: String;
}
