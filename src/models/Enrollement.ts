import { Schema, model } from "mongoose";
import { IEnrollement } from "../types/model.enrollement.type";


const EnrollementSchema: Schema = new Schema<IEnrollement>(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },// etudiant ayant fait le payment
        course_id: { type: Schema.Types.ObjectId, ref: "Course", required: true }, // cours payer par l'etudiant
        start_date: { type: Date, required: true },
        status: { type: String, enum: ["pending", "completed", "canceled"], required: true },
        completion_date: { type: Date },
        isPayed: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);


const Enrollement = model<IEnrollement>("Enrollement", EnrollementSchema);
export default Enrollement;
