import { Document, Schema } from "mongoose";

export interface ICourse extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    path_image: string;
    path_video: string;
    description: string;
    price: Number;
    isCertified: Boolean;
    duration: string;
    created_by: Schema.Types.ObjectId;
    studyLevel_id?: Schema.Types.ObjectId;
    category_id?: Schema.Types.ObjectId;
    job_id?: Schema.Types.ObjectId;
}
