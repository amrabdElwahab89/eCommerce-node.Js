import Joi from "joi";
import { objectIdValidation } from "../../middlewares/validation.middleware.js";

// 01-add to cart (msh moktan3 ama shayf eno el mafrod ykon array)
// export const addToCart = Joi.object({
//   products: Joi.array().items({
//     productId: Joi.string().required().custom(objectIdValidation),
//     quantity: Joi.number().min(1).required(),
//   }),
// }).required();

// 01-add to cart (msh moktan3 ama shayf eno el mafrod ykon array)
export const addToCart = Joi.object({
  productId: Joi.custom(objectIdValidation).required(),
  quantity: Joi.number().integer().min(1).required(),
}).required();

// 02-Update Products in cart

export const updateProductsInCart = Joi.object({
  productId: Joi.string().custom(objectIdValidation).required(),
  quantity: Joi.number().integer().required(),
}).required();

// 03-remove one Item from cart
export const removeOneItemFromCart = Joi.object({
  productId: Joi.custom(objectIdValidation).required(),
}).required();
