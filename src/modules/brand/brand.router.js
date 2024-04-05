import { Router } from "express";
import * as brandValidationSchema from ".//brand.validationSchema.js";
import * as brandController from "./brand.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { uploadFileCloud } from "../../utiles/multer.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";
import { Brand } from "../../../dataBase/models/brand.model.js";

const router = Router();
// 01-Create Brand
router.post(
  "/createBrand",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFileCloud().single("brand"),
  validation(brandValidationSchema.createBrand),
  brandController.createBrand
);

// 02-Update Brand
router.patch(
  "/updateBrand/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFileCloud().single("brand"),
  validation(brandValidationSchema.updateBrand),
  brandController.updateBrand
);

// 03-Delete Brand
router.delete(
  "/deleteBrand/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  validation(brandValidationSchema.deleteBrand),
  brandController.deleteBrand
);

// 04-Show All Brands
router.get("/allBrands", isAuthenticated, brandController.allBrands);

export default router;
