import { Cart } from "../../../dataBase/models/cart.model.js";
import { Coupon } from "../../../dataBase/models/coupon.model.js";
import { Product } from "../../../dataBase/models/products.models.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";
import cloudinary from "../../utiles/cloud.js";
import createInvoice from "../../utiles/pdfInvoice.js";
import path from "path";
import { fileURLToPath } from "url";
import { sendEmails } from "../../utiles/sendEmails.js";
import { clearCart, updateStock } from "./order.service.js";
import { Order } from "../../../dataBase/models/order.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 01-Create Order
export const createOrder = asyncHandler(async (req, res, next) => {
  // 01-get Data
  const { address, phone, payment, code } = req.body;

  // 02-Check Coupon
  //  let CheckCoupon eh lazmtha !!!
  let checkCoupon;
  if (code) {
    checkCoupon = await Coupon.findOne({
      code: code,
      expireAt: { $gt: Date.now() },
    });
  }
  if (!checkCoupon) return next(new Error("theCoupon is not valid"));

  // 03-get Products from cart
  const userCart = await Cart.findOne({ userId: req.user._id });

  // 04-Check if there is Products in cart
  if (userCart.products.length < 1)
    return next(new Error("no Products in the Cart"));

  // 05-Check Product in dataBase and Stock
  let productsFinal = [];
  let orderPrice = 0;

  for (let i = 0; i < userCart.products.length; i++) {
    const product = await Product.findById({
      _id: userCart.products[i].productId,
    });
    if (!product)
      return next(new Error("product in not available in the Stock"));
    if (!product.inStock(userCart.products[i].quantity))
      return next(new Error(`only ${product.availableItems} available`));
    productsFinal.push({
      productId: product._id,
      quantity: userCart.products[i].quantity,
      name: product.name,
      itemPrice: product.price,
      totalPrice: product.price * userCart.products[i].quantity,
    });
    orderPrice += product.price * userCart.products[i].quantity;
  }

  // 06-create Order in dataBase
  const order = await Order.create({
    user: req.user._id,
    products: productsFinal,
    address: address,
    payment: payment,
    phone: phone,
    price: orderPrice,
    // tricky
    code: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });
  console.log("create order in data base");

  // 07-create Invoice
  const invoice = {
    shipping: {
      name: req.user.userName,
      address: address,
      country: "Egypt",
    },
    items: [order.products],
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };
  const pdfPath = path.join(__dirname, `./../../tempInvoices/${order._id}.pdf`);

  createInvoice(invoice, pdfPath);
  console.log("create invoice");

  // 08-upload invoice in cloudinary
  //   change setting in cloudinary (3'lban hatnsaha)
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: "ecommerce/order/invoices",
  });

  // 09-add Invoice in dataBase
  order.invoice = { url: secure_url, id: public_id };
  await order.save();
  console.log("add invoice in dataBase");

  // 10-Send invoice by email to user
  const isSent = await sendEmails({
    to: req.user.email,
    subject: "order Invoice",
    attachments: [{ path: secure_url, contentType: "application.pdf" }],
  });

  if (!isSent) return next(new Error("email not send"));
  console.log("email sent");

  // 11-update Stock
  updateStock(order.products, true);
  console.log("update Stock sent");

  // 12-clear Cart ||to DO isA
  clearCart(req.user._id);
  console.log("clear Cart");

  // 13-return Response ||to DO isA
  return res.json({ success: true, message: productsFinal });
});

// 02-Cancel Order
export const cancelOrder = asyncHandler(async (req, res, next) => {
  // get Data
  const { orderId } = req.params;

  //  get Order and check order is valid
  const order = await Order.findById({ _id: orderId });
  if (!order) return next(new Error("order is not valid", { cause: 400 }));

  //   check order status
  if (
    order.status === "delivered" ||
    order.status === "shipped" ||
    order.status === " canceled"
  )
    return next(new Error("order can not be canceled "));

  // patch Order Status
  order.status = "canceled";
  await order.save();

  // update Stock
  updateStock(order.products, false);

  // return Response
  return res.json({ success: true, message: "order Canceled Successfully" });
});
