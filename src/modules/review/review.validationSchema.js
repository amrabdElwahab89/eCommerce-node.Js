import Joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";

export const createReview = Joi.object({
  productId: Joi.custom(objectIdValidation).required(),
  comment: Joi.string(),
  rating: Joi.number().min(1).max(5),
}).required();

export const updateReview = Joi.object({
  orderId: Joi.custom(objectIdValidation).required(),
  comment: Joi.string(),
  rating: Joi.number().min(1).max(5),
  productId: Joi.custom(objectIdValidation).required(),
}).required();
