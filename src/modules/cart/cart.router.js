import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import * as cartValidationSchema from "./cart.validationSchema.js";
import * as cartController from "./cart.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";

const router = Router();

// 01-add product to Cart
router.post(
  "/addToCart",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartValidationSchema.addToCart),
  cartController.addToCart
);

// 02-update product in the Cart
router.patch(
  "/updateProductInCart",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartValidationSchema.updateProductsInCart),
  cartController.updateProductsInCart
);

// 03-remove one item from cart (patch not delete !!!)

router.patch(
  "/removeOneItemFromCart/:productId",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartValidationSchema.removeOneItemFromCart),
  cartController.removeOneItemFromCart
);

// 04-Delete Cart ( = array called products = [])
router.put(
  "/deleteCart",
  isAuthenticated,
  isAuthorized("user"),
  cartController.deleteCart
);

// 05-all cart component

export default router;
