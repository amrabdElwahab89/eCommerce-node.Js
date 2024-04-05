import mongoose, { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema({
  token: { type: String, required: true },
  user: { type: String },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  isValid: { type: Boolean, default: true },
  agent: { type: String },
  expireAt: { type: String },
});

export const Token = model("Token", tokenSchema);
