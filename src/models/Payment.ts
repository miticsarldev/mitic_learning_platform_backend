import { Schema, model } from "mongoose";
import { IPayment } from "../types/model.payment.type";


const PaymentSchema: Schema = new Schema<IPayment>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true, ref : 'User' },
        course_id: { type: Schema.Types.ObjectId, required: true, ref : 'Course' },
        enrollement_id: { type: Schema.Types.ObjectId, required: true, ref : 'Enrollement' },
        totaAmount: { type: Number, required: true },
        paymentDate: { type: Date, required: true },
        status: { type: String, enum: ["success", "canceled"], required: true  },
    },
    { timestamps: true }
);


const Payment = model<IPayment>("Payment", PaymentSchema);
export default Payment;
