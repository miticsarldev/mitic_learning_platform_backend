import { Document, Schema } from "mongoose";

export interface IProgress extends Document {
    _id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    course_id: Schema.Types.ObjectId;
    current_lesson_id: Schema.Types.ObjectId;
    progress_percentage: number;
    status: string
}