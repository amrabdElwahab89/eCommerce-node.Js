import slugify from "slugify";
import { Category } from "../../../dataBase/models/category.model.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";
import cloudinary from "../../utiles/cloud.js";
import router from "./category.router.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";

// 01-Add Category
export const addCategory = asyncHandler(async (req, res, next) => {
  // Check Image Existence
  if (!req.file) return next(new Error("please Upload File"));

  // Upload Image in Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `eCommerce/Category`,
    }
  );

  // Create Category in Data Base
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
  });

  // Return Response
  return res.json({ success: true, message: "category Created Successfully" });
});

// 02-Update Category
export const updateCategory = asyncHandler(async (req, res, next) => {
  // check category id is exist
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category)
    return next(new Error("Category is not Exist", { cause: 404 }));

  // check Category Owner
  if (category.createdBy.toString() != req.user._id.toString())
    return next(new Error("the User is not the Category Admin"));

  // check file is exist and upload Pic
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: category.image.id,
      }
    );
    category.image = { id: public_id, url: secure_url };
  }

  // update Category
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;

  //   Save Data
  await category.save();

  // return Response
  return res.json({
    success: true,
    message: "Category is Updated Successfully",
  });
});

// 03-Delete Category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  // Check Category Id in DataBase
  const { id } = req.params;
  const category = await Category.findById(id);

  // Check user is the Category Owner
  if (category.createdBy.toString() != req.user._id)
    return next(new Error("User is not the Category Owner"));

  // Delete Category
  await Category.findByIdAndDelete(id);
  // Delete Image from Cloudinary
  await cloudinary.uploader.destroy(category.image.id);
  //   return Response
  return res.json({ success: true, message: "Category Deleted Successfully" });
});

// 04-All Categories
export const allCategories = asyncHandler(async (req, res, next) => {
  const result = await Category.find().populate("subCategory");
  return res.json({ success: true, result });
});
