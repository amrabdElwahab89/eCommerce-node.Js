import { Coupon } from "../../../dataBase/models/coupon.model.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";
import voucher_codes from "voucher-code-generator";

// 01-Create Coupon
export const createCoupon = asyncHandler(async (req, res, next) => {
  // Generate Code
  const code = voucher_codes.generate({
    length: 8,
    // return Array
  });

  // create Coupon
  const { discount, expireAt } = req.body;
  const coupon = await Coupon.create({
    code: code[0],
    discount,
    expireAt: new Date(req.body.expireAt).getTime(),
    createdBy: req.user._id,
  });

  //  return Response
  return res
    .status(201)
    .json({ success: true, message: " coupon Created Successfully" });
});

// 02-Update Coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
  // get Data
  const { code } = req.params;

  // find Coupon
  //   const coupon = await Coupon.findOne({ code, expireAt: { $gt: Date.now() } });
  const coupon = await Coupon.findOne({ code });
  if (!coupon) return next(new Error("the coupon is not exist"));

  // Check the user is the coupon Owner
  if (coupon.createdBy.toString() != req.user._id.toString())
    return next(new Error(" the user is not the coupon admin"));

  // Update Coupon
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expireAt = req.body.expireAt
    ? new Date(req.body.expireAt).getTime()
    : coupon.expireAt;

  // save Coupon
  coupon.save();

  // return Response
  return res.json({ success: true, message: "coupon Updated Successfully" });
});

// 03-Delete Coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  // get Data
  const { code } = req.params;

  // check Coupon is exist
  const coupon = await Coupon.findOne({ code });
  if (!coupon) return next(new Error("the coupon is not exist"));

  // check the user is the coupon owner
  if (coupon.createdBy.toString() != req.user._id.toString())
    return next(new Error("the user is not the coupon Owner"));

  // Delete Coupon
  await Coupon.findOneAndDelete(code);
  // send Response
  return res.json({
    success: true,
    message: "the coupon Deleted Successfully",
  });
});

// 04-All Coupons
export const allCoupons = asyncHandler(async (req, res, next) => {
  // check the user is admin
  if (req.user.role === "admin") {
    const coupons = await Coupon.find();
    return res.json({ success: true, result: { coupons } });
  }
  // Check the user is seller
  if (req.user.role === "seller") {
    const coupons = await Coupon.findOne({ createdBy: req.user._id });
    return res.json({ success: true, result: { coupons } });
  }
});
