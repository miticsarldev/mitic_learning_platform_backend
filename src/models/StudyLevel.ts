import { Schema, model } from "mongoose";
import { IStudyLevel } from "../types/model.studyLevel";

const StudyLevelShema: Schema = new Schema<IStudyLevel>(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);


const StudyLevel = model<IStudyLevel>("StudyLevel", StudyLevelShema);
export default StudyLevel;
