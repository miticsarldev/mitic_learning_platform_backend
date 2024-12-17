import { Document, Schema } from "mongoose";

export interface IPayment extends Document {
    _id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    course_id: Schema.Types.ObjectId;
    enrollement_id: Schema.Types.ObjectId;
    totaAmount: Number;
    paymentDate: Date;
    status: "success" | "canceled";
}
