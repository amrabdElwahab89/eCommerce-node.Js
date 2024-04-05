import Joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";

export const createOrder = Joi.object({
  // regex for Phone
  phone: Joi.string().required(),
  address: Joi.string().required(),
  payment: Joi.string().valid("cash", "visa").required(),
  code: Joi.string().length(8),
}).required();

export const cancelOrder = Joi.object({
  orderId: Joi.custom(objectIdValidation).required(),
}).required();
