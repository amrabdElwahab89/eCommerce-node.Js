import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { uploadFileCloud } from "../../utiles/multer.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as categoryValidationSchema from "./categoryValidationSchema.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";

const router = Router();

// 00-subCategory
router.use("/:categoryId/subCategory", subCategoryRouter);

// 01-Add Category
router.post(
  "/addCategory",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFileCloud().single("category"),
  validation(categoryValidationSchema.createCategorySchema),
  categoryController.addCategory
);

// 02-Update Category
router.patch(
  "/updateCategory/:id",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFileCloud().single("category"),
  validation(categoryValidationSchema.updateCategory),
  categoryController.updateCategory
);
// 03-Delete Category
router.delete(
  "/deleteCategory/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(categoryValidationSchema.deleteCategory),
  categoryController.deleteCategory
);

// 04-All Categories
router.get("/allCategories", categoryController.allCategories);

export default router;
