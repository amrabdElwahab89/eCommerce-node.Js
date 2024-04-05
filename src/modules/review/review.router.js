import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as reviewValidationSchema from "./review.validationSchema.js";
import * as reviewController from "./review.controller.js";

const router = Router({ mergeParams: true });

// 01-Create Review
router.post(
  "/crateReview",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewValidationSchema.createReview),
  reviewController.createReview
);
// 02-Update Review
router.patch(
  "/updateReview/:productId",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewValidationSchema.updateReview),
  reviewController.updateReview
);

export default router;
