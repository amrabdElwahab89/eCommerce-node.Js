import { nanoid } from "nanoid";
import { Brand } from "../../../dataBase/models/brand.model.js";
import { Category } from "../../../dataBase/models/category.model.js";
import { SubCategory } from "../../../dataBase/models/subCategory.model.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";
import { Product } from "../../../dataBase/models/products.models.js";
import cloudinary from "../../utiles/cloud.js";

// 01-create Product(later-isA)
export const createProducts = asyncHandler(async (req, res, next) => {
  // get Data
  const { categoryId, subCategoryId, brandId } = req.body;
  // check Category
  const category = await Category.findById(categoryId);
  if (!category) return next(new Error("category is not exist"));

  // check subCategory
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) return next(new Error("subCategory is not exist"));

  // check Brand
  const brand = await Brand.findById(brandId);
  if (!brand) return next(new Error("brand is not exist"));

  // check File
  if (!req.files) return next(new Error("please upload file"));

  // create cloudFolder
  const cloudFolder = nanoid();

  // upload Image(later-isA)
  let images = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `eCommerce/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }

  // Upload subImage (later-isA)
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `eCommerce/products/${cloudFolder}` }
  );

  // Create Product
  await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images,
  });

  // return Response
  return res.json({ success: true, message: "product Created SuccessFully" });
});

// 02-delete Product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  // get data
  const { productId } = req.params;
 

  // check Product
  const product = await Product.findById(productId);
 
  if (!product) return next(new Error("product is not exist"));

  // delete product from data base
  await product.deleteOne();

  // delete images form Cloudinary (Later isA)
  const ids = product.images.map((image) => image.id);
  ids.push(product.defaultImage.id);
  await cloudinary.api.delete_resources(ids);

  // delete empty folder (note : should be empty folder)
  await cloudinary.api.delete_folder(
    `eCommerce/products/${product.cloudFolder}`
  );
  // return Response
  return res.json({ success: true, message: "product deleted Successfully" });
});

// 03-get products (Search)
export const searchProducts = asyncHandler(async (req, res, next) => {
  // get data
  const { keyWord } = req.query;

  // search for word or letter using regex
  const results = await Product.find({
    name: { $regex: keyWord, $options: "i" },
  });

  // return response
  return res.json({ success: true, result: results });
});

// 04-FilterProducts
export const filterProducts = asyncHandler(async (req, res, next) => {
  // filter Products
  const results = await Product.find({ ...req.query });

  // Return Response
  return res.json({ success: true, result: results });
});

// 05-sortProducts
export const sortProducts = asyncHandler(async (req, res, next) => {
  // get Data
  const { sort } = req.query;

  //   Sort Products
  const results = await Product.find().sort(sort);

  //   return Response
  return res.json({ success: true, result: results });
});

// 06-Pagination
export const paginationProducts = asyncHandler(async (req, res, next) => {
  // Get Data
  let { page } = req.query;
  page = page < 1 || isNaN(page) || !page ? 1 : page;

  const limit = 1;
  const skip = limit * (page - 1);

  //   Get data from dataBase
  const results = await Product.find().skip(skip).limit(limit);

  //  return Response
  return res.json({ success: true, result: results });
});

// 07-07-search & filter & sort & Pagination

export const allFeatures = asyncHandler(async (req, res, next) => {
  // get Data
  const { page, keyword, sort, category, subCategory, brand } = req.query;

  //   search in dataBase
  const results = await Product.find({ ...req.query })
    .sort(sort)
    .paginate(page)
    .search(keyword);

  //   return response
  return res.json({ success: true, results });
});
