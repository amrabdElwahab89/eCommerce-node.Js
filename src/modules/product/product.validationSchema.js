import Joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";
import { isValidObjectId } from "mongoose";

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  availableItems: Joi.number().required(),
  soldItems: Joi.number().required(),
  price: Joi.number().required(),
  discount: Joi.number(),
  categoryId: Joi.string().custom(objectIdValidation).required(),
  subCategoryId: Joi.string().custom(objectIdValidation).required(),
  brandId: Joi.string().custom(objectIdValidation).required(),
}).required();

export const deleteProduct = Joi.object({
  productId: Joi.custom(isValidObjectId).required(),
}).required();

