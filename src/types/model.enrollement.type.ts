import { Document, Schema } from "mongoose";

export interface IEnrollement extends Document {
    _id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    course_id: Schema.Types.ObjectId;
    start_date: Date;
    status: "pending" | "completed" | "canceled";
    completion_date: Date;
    progress: string;
    isPayed: Boolean;
}
