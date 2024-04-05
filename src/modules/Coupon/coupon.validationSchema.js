import Joi from "joi";

// 01-Create Coupon
export const createCouponSchema = Joi.object({
  discount: Joi.number()
    .required()
    .integer()
    .options({ convert: false })
    .min(0)
    .max(100),
  expireAt: Joi.date().required().greater(Date.now()),
});

// 02-Update Coupon
export const updateCouponSchema = Joi.object({
  expireAt: Joi.date().greater(Date.now()),
  discount: Joi.number().integer().options({ convert: false }).min(0).max(100),
  code: Joi.string().required(),
});

// 03-Delete Coupon
export const deleteCoupon = Joi.object({
  code: Joi.string().required(),
});
