import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { id: { type: String }, url: { type: String } },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", unique: true },
  },
  { timestamps: true }
);
export const Brand = model("Brand", brandSchema);
