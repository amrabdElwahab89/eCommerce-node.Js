import Joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(10).required(),
}).required();

export const updateCategory = Joi.object({
  name: Joi.string().min(2).max(10).required(),
  id: Joi.string().custom(objectIdValidation).required(),
}).required();

export const deleteCategory = Joi.object({
  id: Joi.string().custom(objectIdValidation).required(),
}).required();
