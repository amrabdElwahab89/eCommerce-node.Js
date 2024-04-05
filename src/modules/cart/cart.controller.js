import { Cart } from "../../../dataBase/models/cart.model.js";
import { Product } from "../../../dataBase/models/products.models.js";
import { User } from "../../../dataBase/models/user.model.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";

// 01-add product to Cart (To do isA feha 7aga 3'lt ana 3awz ab3t array w aya b3tt object bs)
export const addToCart = asyncHandler(async (req, res, next) => {
  // get Data
  const { productId, quantity } = req.body;

  // find User in USER
  const user = await User.findOne({ _id: req.user._id });

  // check product is valid in PRODUCT
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product is not found"));

  // check Stock in PRODUCT
  if (!product.inStock(quantity))
    return next(
      new Error(`sorry only ${product.availableItems} are available`)
    );

  // find Cart and push the products in CART
  //   Case01
  const cartCase01 = await Cart.findOne({
    userId: req.user._id,
    "products.productId": productId,
  });

  if (cartCase01) {
    const theProduct = cartCase01.products.find(
      (ele) => ele.productId.toString() === productId.toString()
    );

    //   check the Stock
    if (product.inStock(theProduct.quantity + quantity)) {
      theProduct.quantity = theProduct.quantity + quantity;
      await cartCase01.save();
      return res.json({ success: true, result: { cartCase01 } });
    } else {
      return next(new Error(`only available ${product.availableItems}only`));
    }
  }

  // find Cart and push the products in CART
  //   Case02

  const cartCase02 = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $push: { products: [{ productId, quantity }] } },
    { new: true }
  );

  // check cart and product
  if (!cartCase02) return next(new Error("cart or product is not exist"));

  // send Response
  return res.json({ success: true, cartCase02 });
});

// 02-update Cart
export const updateProductsInCart = asyncHandler(async (req, res, next) => {
  // get Data
  const { productId, quantity } = req.body;

  //   check product is valid
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product is not found"));

  // check available Items (check Stock)
  if (product.inStock(quantity))
    return next(new Error(`sorry only ${product.availableItems} is exist`));

  // find and Update
  const cartProducts = await Cart.findOneAndUpdate(
    { userId: req.user._id, "products.productId": productId },
    { "products.$.quantity": quantity },
    { new: true }
  );

  // return Response
  return res.json({ success: true, results: { cartProducts } });
});

// 03-remove item from cart
export const removeOneItemFromCart = asyncHandler(async (req, res, next) => {
  // Get data
  const { productId } = req.params;

  // check product exist
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product is not exist"));

  // find and delete product (!! update cart)
  const results = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { products: { productId } } },
    { new: true }
  );

  // return Response
  return res.json({ success: true, result: results });
});

// 04-Delete Cart ( = array called products = [])
export const deleteCart = asyncHandler(async (req, res, next) => {
  // find and make array []
  await Cart.findOneAndUpdate({ userId: req.user._id }, { products: [] });
  // return Response
  res.json({ success: true, message: "cart is empty" });
});
