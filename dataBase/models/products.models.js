import { Schema, Types, model } from "mongoose";

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { id: { type: String }, URL: { type: String } },
    defaultImage: { id: { type: String }, URL: { type: String } },
    availableItems: { type: Number, required: true },
    soldItems: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, required: true },
    // fen ref:"Category" and "SubCategory" comment
    categoryId: { type: Types.ObjectId, required: true },
    subCategoryId: { type: Types.ObjectId, required: true },
    brandId: { type: Types.ObjectId, required: true },
    cloudFolder: { type: String, required: true },
    averageRate: { type: String, min: 1, max: 5 },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productsSchema.virtual("review", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

productsSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});

// Query Helper
// 01-(Paginate)
productsSchema.query.paginate = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;

  const limit = 1;
  const skip = limit * (page - 1);
  return this.skip(skip).limit(limit);
};

// 02-Search
productsSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
  }
  return this; //query
};
// Methods (Check product in stock)
productsSchema.methods.inStock = function (requiredQuantity) {
  return this.availableItems >= requiredQuantity ? true : false;
};

export const Product = model("Product", productsSchema);
