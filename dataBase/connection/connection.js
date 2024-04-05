import mongoose from "mongoose";


export const connectionToDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION)
    .then(() => {
      console.log("Connected to the database.....");
    })
    .catch((error) => {
      console.log("Error connecting to the database:", error);
    });
};
