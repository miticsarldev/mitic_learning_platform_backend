import { Schema, model } from "mongoose";
import { ICourse } from "../types/model.course.type";


const CourseSchema: Schema = new Schema<ICourse>(
    {
        title: { type: String, required: true },
        description: { type: String },
        path_image: { type: String },
        path_video: { type: String },
        price: { type: Number, min: 0, default: null },
        isCertified: { type: Boolean, default: false },
        duration: { type: String },
        status: { type: Boolean, default: false },
        created_by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        studyLevel_id: { type: Schema.Types.ObjectId, ref: "StudyLevel" },
        job_id: { type: Schema.Types.ObjectId, ref: "Job" },
        category_id: { type: Schema.Types.ObjectId, ref: "Category" },
    },
    { timestamps: true }
);


const Course = model<ICourse>("Course", CourseSchema);
export default Course;
