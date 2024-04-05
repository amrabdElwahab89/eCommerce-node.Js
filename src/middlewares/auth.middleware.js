import jwt from "jsonwebtoken";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { Token } from "../../dataBase/models/token.model.js";
import { User } from "../../dataBase/models/user.model.js";

// hint when i signed in the backend generate token for this user but i have to chack if the user is already exsist so i check befor any important proccess the token
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // get Token from Header
  let { token } = req.headers;

  //   check if token is exist
  if (!token) {
    return res.json({ success: false, message: "user not found" });
  }

  // check prefix
  if (!token.startsWith("Route__"))
    return next(new Error("Invalid Token prefix"));
  token = token.split("Route__")[1];

  // check is token is valid ??
  const checkTokenInDb = await Token.findOne({ token, isValid: true });

  if (!checkTokenInDb) {
    return next(new Error("Token is not valid"));
  }

  // verify token
  const payload = jwt.verify(token, "secrete key");

  //   find User
  const user = await User.findOne(payload.userId);
  if (!user) return next(new Error("user is not exist"));

  //   pass user's data to next controller
  req.user = user;

  // call next controller
  return next();
});
