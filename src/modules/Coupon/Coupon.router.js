import { Router } from "express";
import * as couponValidationSchema from "./coupon.validationSchema.js";
import * as couponController from "./coupon.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { validation } from "../../middlewares/validation.middleware.js";

const router = Router();

// 01-Create Coupon
router.post(
  "/createCoupon",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponValidationSchema.createCouponSchema),
  couponController.createCoupon
);

// 02-Update Coupon
router.patch(
  "/updateCoupon/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponValidationSchema.updateCouponSchema),
  couponController.updateCoupon
);

// 03-Delete Coupon
router.delete(
  "/deleteCoupon/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponValidationSchema.deleteCoupon),
  couponController.deleteCoupon
);

// 04-All Coupons
router.get(
  "/allCoupons",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  couponController.allCoupons
);

export default router;
