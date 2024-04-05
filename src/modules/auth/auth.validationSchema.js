import Joi from "joi";

export const signUpSchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  // pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().valid("admin", "seller", "customer").required(),
  age: Joi.number().min(18).max(50).required(),
  gender: Joi.string().valid("male", "female").required(),
  phone: Joi.string()
    .pattern(/^01[0-9]{9}$/)
    .required(),
}).required();

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
}).required();

export const forgetCodeSchema = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(12),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
}).required();
