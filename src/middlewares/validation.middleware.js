import { Schema, Types } from "mongoose";

export const objectIdValidation = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return true;
  return helper.message("invalid ObjectID");
};

export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.query, ...req.params };
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map((obj) => {
        return obj.message;
      });
      return next(new Error(errorMessages));
    }
    return next();
  };
};
