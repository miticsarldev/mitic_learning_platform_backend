import { Document, Schema } from "mongoose";

export interface ILessons extends Document {
    _id: Schema.Types.ObjectId;
    title: String;
    description: String;
    duration: String;
    order: String;
    course_id: String;
}
