import { Schema, model } from "mongoose";
import { IJob } from "../types/model.job.type";

const JobShema: Schema = new Schema<IJob>(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);


const Job = model<IJob>("Job", JobShema);
export default Job;
