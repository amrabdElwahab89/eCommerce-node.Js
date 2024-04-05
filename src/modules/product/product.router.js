import { Router } from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { uploadFileCloud } from "../../utiles/multer.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as productController from "./product.controller.js";
import * as productValidationSchema from "./product.validationSchema.js";
import reviewRouter from "../review/review.router.js";
const router = Router();

// merge Params (Review)
router.use("/:productId/review", reviewRouter);

//01-create Product(later-isA)

router.post(
  "/createProduct",
  isAuthenticated,
  isAuthorized("seller"),
  uploadFileCloud().fields([
    { name: "defaultImage", maxCount: 2 },
    { name: "subImages", maxCount: 3 },
  ]),
  validation(productValidationSchema.createProductSchema),
  productController.createProducts
);
// 02-delete Product
router.delete(
  "/deleteProduct/:productId",
  isAuthenticated,
  isAuthorized("seller"),
  validation(productValidationSchema.deleteProduct),
  productController.deleteProduct
);

// 03-searchProducts
router.get("/searchProducts", productController.searchProducts);

// 04-filterProducts
router.get("/filterProducts", productController.filterProducts);

// 05-sortProducts
router.get("/sortProducts", productController.sortProducts);

// 06-Pagination
router.get("/paginationProducts", productController.paginationProducts);

// 07-search & filter & sort & Pagination
router.get("/", productController.allFeatures);

export default router;
