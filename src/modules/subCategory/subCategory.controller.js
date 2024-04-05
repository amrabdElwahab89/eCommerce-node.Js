import slugify from "slugify";
import { SubCategory } from "../../../dataBase/models/subCategory.model.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";
import cloudinary from "../../utiles/cloud.js";
import { Category } from "../../../dataBase/models/category.model.js";

// 01-Add Category
export const addSubCategory = asyncHandler(async (req, res, next) => {
  // check image existence
  if (!req.file) return next(new Error("please Upload File"));

  //   Check Category Id is Exist
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("Category is not exist"));

  //   upload Image in Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `ecommerce/${category.name}/${req.body.name}` }
  );

  //   Create SubCategory in Data Base
  const subCategory = await SubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    categoryId,
  });
  //   return Response
  return res.json({
    success: true,
    message: "SubCategory Created Successfully",
  });
});

// 02-Update Category
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  // check subCategoryId
  const { subCategoryId } = req.params;
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) return next(new Error("SUbCategory is not Exist"));

  //   check SubCategory Owner
  if (subCategory.createdBy.toString() != req.user._id.toString())
    return next(new Error("user is not authorized"));

  // check File Existence
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: subCategory.image.id,
      }
    );
    subCategory.image = { id: public_id, url: secure_url };
  }

  // update SubCategory and save it
  subCategory.name = req.body.name ? req.body.name : subCategory.name;
  await subCategory.save();

  //   Send Response
  return res.json({
    success: true,
    message: "SubCategory Updated Successfully",
  });
});

// 03-Delete subCategory
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  // Check the subCategoryId
  const { subCategoryId } = req.params;

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory)
    return next(new Error("the SubCategory id is not available"));

  // check user is the subCategory owner
  if (subCategory.createdBy.toString() != req.user._id)
    return next(new Error("the user is not Authorized"));

  // delete subCategory
  await SubCategory.findByIdAndDelete(subCategoryId);

  // Delete images from cloudinary
  await cloudinary.uploader.destroy(subCategory.image.id);

  // send Response
  return res.json({
    success: true,
    message: "subCategory Deleted SuccessFully",
  });
});

// 04-All subCategories
export const allSubCategories = asyncHandler(async (req, res, next) => {
  const results = await SubCategory.find();
  return res.json({ success: true, results });
});
