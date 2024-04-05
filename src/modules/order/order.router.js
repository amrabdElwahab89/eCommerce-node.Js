import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as orderValidationSchema from "./order.validationSchema.js";
import * as orderController from "./order.controller.js";

const router = Router();

//01-create Order
router.post(
  "/createOder",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderValidationSchema.createOrder),
  orderController.createOrder
);
// 02-cancel Order
router.patch(
  "/cancelOrder/:orderId",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderValidationSchema.cancelOrder),
  orderController.cancelOrder
);

export default router;
