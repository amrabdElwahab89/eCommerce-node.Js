import express from "express";
import { connectionToDB } from "./dataBase/connection/connection.js";
import dotenv from "dotenv";
import authRouter from "./src/modules/auth/auth.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import subCategoryRouter from "./src/modules/subCategory/subCategory.router.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import couponRouter from "./src/modules/Coupon/Coupon.router.js";
import productRouter from "./src/modules/product/product.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import createInvoice from "./src/utiles/pdfInvoice.js";
import orderRouter from "./src/modules/order/order.router.js";
import reviewRouter from "./src/modules/review/review.router.js";
import cors from "cors";

const app = express();
dotenv.config();
const port = process.env.PORT;

// cors
// const whitelist = ["http://127.0.0.1:5000"];
// app.use((req, res, next) => {
//   console.log(req.header("origin"));

//   if (req.originalUrl.includes("/auth/verificationLink")) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//   } else {
//     if (!whitelist.includes(req.header("origin"))) {
//       return next(new Error("Blocked By CORS"));
//     }
//     res.setHeader("Access-Control-Allow-Origin", req.header("origin"));
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "*");
//     res.setHeader("Access-Control-Private-Network", true);
//   }
//   next();
// });
app.use(cors());

// parse
app.use(express.json());

// connect to DB
await connectionToDB();

// pdf Invoice

// user APIs
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/subCategory", subCategoryRouter);
app.use("/brand", brandRouter);
app.use("/coupon", couponRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/review", reviewRouter);

// Not Found error
app.all("*", (req, res) => {
  return res.status(404).json({ success: false, message: "Page Not Found" });
});

// Global Error Handler
app.use((error, req, res, next) => {
  return res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});

app.listen(port, () => {
  console.log("Server is running ......");
});
