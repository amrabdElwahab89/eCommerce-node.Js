           import { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
  image: { id: { type: String }, url: { type: String } },
  categoryId: { type: Types.ObjectId, ref: "Category", required: true },
});

export const SubCategory = model("SubCategory", subCategorySchema);
