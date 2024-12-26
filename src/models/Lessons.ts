import { Schema, model } from "mongoose";
import { ILessons } from "../types/model.lessons.type";


const LessonsSchema: Schema = new Schema<ILessons>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: String, required: true },
        order: { type: String, required: true },
        course_id: { type: Schema.Types.ObjectId, required: true },
    },
    { timestamps: true }
);


const Lessons = model<ILessons>("Lessons", LessonsSchema);
export default Lessons;
