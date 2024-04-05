import Joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";

export const createSubCategory = Joi.object({
  name: Joi.string().required(),
  categoryId: Joi.string().custom(objectIdValidation).required(),
}).required();

export const updateSubCategory = Joi.object({
  categoryId: Joi.string().custom(objectIdValidation).required(),
  subCategoryId: Joi.string().custom(objectIdValidation).required(),
  name: Joi.string().required(),
});

export const deleteSubCategory = Joi.object({
  categoryId: Joi.string().custom(objectIdValidation).required(),
  subCategoryId: Joi.string().custom(objectIdValidation).required(),
});
