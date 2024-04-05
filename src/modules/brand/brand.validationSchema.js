import Joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";

export const createBrand = Joi.object({
  name: Joi.string().required().min(2).max(15).required(),
  categoryId: Joi.array()
    .items(Joi.string().custom(objectIdValidation).required())
    .required(),
});

export const updateBrand = Joi.object({
  name: Joi.string().required().min(2).max(15).required(),
  id: Joi.string().custom(objectIdValidation),
}).required();

export const deleteBrand = Joi.object({
  categoryId: Joi.array().items(
    Joi.string().custom(objectIdValidation).required()
  ),
  brandId: Joi.string().required().custom(objectIdValidation),
}).required();
