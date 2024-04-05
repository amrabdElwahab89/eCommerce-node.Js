import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { uploadFileCloud } from "../../utiles/multer.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as subCategoryValidationSchema from "./subCategoryValidationSchema.js";
import * as subCategoryController from "./subCategory.controller.js";

const router = Router({ mergeParams: true });

// 01-Create SubCategory
router.post(
  "/addSubCategory",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFileCloud().single("subCategory"),
  validation(subCategoryValidationSchema.createSubCategory),
  subCategoryController.addSubCategory
);

// 02-Update SubCategory
router.patch(
  "/updateSubCategory/:subCategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFileCloud().single("subCategory"),
  validation(subCategoryValidationSchema.updateSubCategory),
  subCategoryController.updateSubCategory
);

// 03-Delete SubCategory
router.delete(
  "/deleteSubCategory/:subCategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  validation(subCategoryValidationSchema.deleteSubCategory),
  subCategoryController.deleteSubCategory
);

//   04-All SubCategories
router.get("/allSubCategories",isAuthenticated, subCategoryController.allSubCategories);

export default router;
