import { Schema, model } from "mongoose";
import { IJob } from "../types/model.job.type";

const CategoryShema: Schema = new Schema<IJob>(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);


const Job = model<IJob>("Job", CategoryShema);
export default Job;
