import { Order } from "../../../dataBase/models/order.model.js";
import { Product } from "../../../dataBase/models/products.models.js";
import { Review } from "../../../dataBase/models/review.model.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";

// 01-Create Review
export const createReview = asyncHandler(async (req, res, next) => {
  // get data
  const { rating, comment } = req.body;
  const { productId } = req.params;

  // check product in order
  const order = await Order.findOne({
    user: req.user._id,
    // trick
    "products.productId": productId,
    Status: "delivered",
  });

  if (!order) return next(new Error("you can not review this product"));

  //   check Past Reviews
  const review = await Review.findOne({
    createdBy: req.user._id,
    productId: productId,
  });
  if (review) return next(new Error("you have been rated this product before"));

  //   create Review
  const newReview = await Review.create({
    productId: productId,
    createdBy: req.user._id,
    orderId: order._id,
    comment: comment,
    rating: rating,
  });
  //   calculate Average Rate
  let calcRate = 0;
  const product = await Product.findById({ productId });
  const reviews = await Review.findOne({ productId: productId });

  for (let i = 0; i < reviews.length; i++) {
    calcRate += reviews[i].rating;
  }
  product.averageRate = calcRate / reviews.length;
  await product.save();

  // return Response
  return res.json({ success: true, message: "review Created Successfully" });
});

// 02-Update Review
export const updateReview = asyncHandler(async (req, res, next) => {
  // get data
  const { reviewId, productId } = req.params;
  const { rating, comment } = req.body;

  // check review
  const review = await Review.findById({ reviewId });
  if (!review) return next(new Error("you have not reviewed this product "));

  // update Review
  review.comment = comment ? comment : review.comment;
  review.rating = rating ? rating : review.rating;
  // reCalculate average Rating
  let calcRate = 0;
  const product = await Product.findById({ productId });
  const reviews = await Review.findOne({ productId: productId });

  for (let i = 0; i < reviews.length; i++) {
    calcRate += reviews[i].rating;
  }
  product.averageRate = calcRate / reviews.length;
  await product.save();

  // return response
  return res.json({ success: true, message: "review Updated Successfully" });
});
