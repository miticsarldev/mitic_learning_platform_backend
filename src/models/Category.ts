import { Schema, model } from "mongoose";
import { ICategory } from "../types/model.category.type";

const CategoryShema: Schema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
        description: { type: String },
    },
    { timestamps: true }
);


const Category = model<ICategory>("Category", CategoryShema);
export default Category;
