import { Timestamp } from "mongodb";
import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      default: "customer",
    },

    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female"] },
    phone: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    forgetCode: { type: String },
    profilePic: { secure_url: String, public_id: String },
    coverPics: [{ secure_url: String, public_id: String }],
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
