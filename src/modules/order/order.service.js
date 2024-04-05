import { Cart } from "../../../dataBase/models/cart.model.js";
import { Product } from "../../../dataBase/models/products.models.js";

export const updateStock = async (products, createOrder) => {
  try {
    // trick
    if (createOrder) {
      for (const product of products) {
        await Product.findByIdAndUpdate(product.productId, {
          $inc: {
            soldItems: product.quantity,
            availableItems: -product.quantity,
          },
        });
      }
    } else {
      for (const product of products) {
        await Product.findByIdAndUpdate(product.productId, {
          $inc: {
            soldItems: -product.quantity, // reverse the soldItems adjustment
            availableItems: +product.quantity,
          },
        });
      }
    }
    console.log("Stock updated successfully");
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
};

export const clearCart = async (userId) => {
  await Cart.findByIdAndUpdate({ user: userId }, { products: [] });
};
