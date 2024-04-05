import slugify from "slugify";
import { Brand } from "../../../dataBase/models/brand.model.js";
import { Category } from "../../../dataBase/models/category.model.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";
import cloudinary from "../../utiles/cloud.js";

// 01-Create Brand
export const createBrand = asyncHandler(async (req, res, next) => {
  // Check Categories
  const { categoryId } = req.body;

  categoryId.forEach(async (element) => {
    const category = await Category.findById(element);
    if (!category)
      return next(new Error(`category id ${element} is not found`));
  });

  // check File
  if (!req.file) next(new Error("Kindly Upload Image"));

  // Upload FIle
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `eCommerce/Brands`,
    }
  );

  // Create Brand

  const brand = await Brand.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: { id: public_id, url: secure_url },
    createdBy: req.user._id,
  });

  //  add brand in each [Category] (tary2 zay el zft el mafrod fe el brand model azawd category and subCategory badl el lafa de kolha)

  categoryId.forEach(async (element) => {
    const category = await Category.findById(element);
    //     category.brand.push(brand._id);
    //     await category.save();
    await Category.findByIdAndUpdate(element, { $push: { brand: brand._id } });
  });

  //   add brand in each [SubCategory]

  // return Response
  return res.json({ success: true, message: "brand Created Successfully" });
});

// 02-Update Brand (To do isA)
export const updateBrand = asyncHandler(async (req, res, next) => {
  // Check brand Id in data base
  const { brandId } = req.params;
  const brand = await Brand.findById(brandId);
  if (!brand) return next(new Error("kindly ENter Correct Id"));

  // check user is the brand owner
  if (req.user._id != brand.createdBy)
    return next(new Error("the user is not the brand Owner"));

  // Check File and Upload Image
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: brand.image.id,
      }
    );
    brand.image = { id: public_id, url: secure_url };
  }

  // Update Brand
  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

  //   Save Data
  brand.save();

  // Return  Response
  return res.json({ success: true, message: "brand Updated Successfully" });
});

// 03-Delete Brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  // Get Data
  const { brandId } = req.params;
  const { categoryId } = req.body;

  // Check Brand iD is Exist
  const brand = await Brand.findById(brandId);
  if (!brand) return next(new Error("brand is not exist"));

  // check user is the owner
  if (brand.createdBy.toString() !== req.user._id.toString())
    return next(new Error(" the user is not the Brand Owner"));

  // Delete Brand
  await Brand.findByIdAndDelete(brandId);

  // delete Image from Cloudinary
  await cloudinary.uploader.destroy(brand.image.id);

  // Delete Brand form Category (The Hardest Approach)
  categoryId.forEach(async (element) => {
    await Category.updateMany({}, { $pull: { brand: brand._id } });
  });

  // Delete Brand from subCategory (the hardest Approach)

  // Return Response
  return res.json({ success: true, message: " Brand Deleted Successfully" });
});

// 04-Show All Brands
export const allBrands = asyncHandler(async (req, res, next) => {
  // find Brands in DB
  const results = await Brand.find();

  // return Response
  return res.json({ success: true, results });
});
