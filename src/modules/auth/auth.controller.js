import { User } from "../../../dataBase/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "../../../dataBase/models/token.model.js";
import { asyncHandler } from "../../utiles/asyncHandler.js";
import { sendEmails } from "../../utiles/sendEmails.js";
import { resetPassTemp, signUpTemp } from "../../utiles/htmlTemplates.js";
import randomstring from "randomstring";
import cloudinary from "../../utiles/cloud.js";
import { Cart } from "../../../dataBase/models/cart.model.js";

// 01.01-sign up ( email must be unique ) => Done
export const signup = asyncHandler(async (req, res, next) => {
  // check password & confirmPassword
  const { password, confirmPassword, email } = req.body;
  if (password !== confirmPassword) {
    return next(new Error("password and confirmPassword do not match"));
  }

  // check if the email Exist
  const isUser = await User.findOne({ email });
  if (isUser) {
    return next(new Error("Email is already exist"));
  }

  //  Hash Password
  const hashPassword = bcryptjs.hashSync(password, 8);

  // Create User (isConfirmed = false)
  const user = await User.create({
    ...req.body,
    password: hashPassword,
  });

  //   create Token
  const token = jwt.sign({ email }, "secrete key");
  const link = `http://localhost:3000/auth/verificationLink/${token}`;

  //   sendEmail (return true or false)
  const messageSent = await sendEmails({
    to: email,
    subject: "Registration code",
    html: signUpTemp(link),
  });

  if (!messageSent) return next(new Error("email is invalid", { cause: 404 }));
  return res.json({ success: true, results: { user } });
});

// 01.02-Verification Link
export const verificationLink = asyncHandler(async (req, res, next) => {
  // get data
  const { token } = req.params;
  const payload = jwt.verify(token, "secrete key");

  //   update in dataBase
  const user = await User.findOneAndUpdate(
    // { email: payload.email },
    { isConfirmed: true }
  );
  //   Create Card

  await Cart.create({ userId: user._id });

  //   return response
  return res.json({ success: true, result: "isConfirmed Updated" });
});

// 02.01-ForgetCode
export const forgetCode = asyncHandler(async (req, res, next) => {
  // get data
  const { email } = req.body;

  //   check email is exist
  const isUser = await User.findOne({ email });
  if (!isUser) return next(new Error("email is not exist"));

  //   check isConfirmed
  if (isUser.isConfirmed != true)
    return next(new Error("account is not activated"));
  // Generate Random code

  const code = randomstring.generate({
    length: 12,
    charset: "alphabetic",
  });

  // save code in dataBase
  isUser.forgetCode = code;
  await isUser.save();

  // Send Email
  const sendMessage = await sendEmails({
    to: isUser.email,
    subject: "trialForgetCode",
    html: resetPassTemp(code),
  });

 
  // check email is Sent
  if (!sendMessage) return next(new Error("message not sent"));

  //  Response
  return res.send("forgetCode Send Successfully");
});

// 02.02-Reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
  // get Data
  const { email, code, password, confirmPassword } = req.body;

  // user (email) is valid
  const isUser = await User.findOne({ email });
  if (!isUser) return next(new Error("email is not valid"));

  // check code
  if (isUser.forgetCode !== code) return next(new Error("code in not valid"));

  // set thPassword and Hash it
  const hashPassword = bcryptjs.hashSync(password, 8);
  isUser.password = hashPassword;
  isUser.confirmPassword = hashPassword;
  await isUser.save();

  //   find all the tokens of the user
  const allTokens = await Token.find({ userId: isUser._id });

  // invalid All tokens
  allTokens.forEach(async (token) => {
    token.isValid = false;
    await Token.save();
    // response
  });
  return res.json({ success: true, message: "Password Reset" });
});

// 03-Upload Profile Pic
export const profilePic = asyncHandler(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);

  //   upload image on cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `user/${id}/pp`,
    }
  );

  //   save url in dataBase
  user.profilePic = { secure_url, public_id };
  await user.save();
  //   response
  return res.json({
    success: true,
    message: "Profile Pic Uploaded Successfully",
  });
});

// 04-Upload cover pics
export const coverPics = asyncHandler(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);

  for (let index = 0; index < req.files.length; index++) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files[index].path,
      { folder: `user/${id}/coverPics` }
    );
    user.coverPics.push({ secure_url, public_id });
  }

  await user.save();

  // Response
  return res.json({
    success: true,
    message: "Cover Pic Uploaded Successfully",
  });
});

// 05-Update Profile Pic
export const updateProfilePic = asyncHandler(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);

  //   Upload Image and Update
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { public_id: user.profilePic.public_id }
  );

  //   save pic in dataBase
  user.profilePic = { secure_url, public_id };
  await user.save();

  //   response
  return res.json({ success: true, message: "pp Updated Successfully" });
});

// 06-sign in =>Done
export const logIn = asyncHandler(async (req, res, next) => {
  // get Data
  const { email, password } = req.body;

  // check email
  const isUser = await User.findOne({ email });
  if (!isUser) {
    return next(new Error("email is invalid"));
  }

  //   check isConfirmed is true
  if (isUser.isConfirmed != true)
    return next(new Error("this account is not activated"));

  // check Password
  const match = bcryptjs.compareSync(password, isUser.password);
  if (!match) {
    return next(new Error("password is incorrect"));
  }

  // Generate Token
  const token = jwt.sign(
    { id: isUser._id, email: isUser.email },
    "secrete key"
  );

  // Save token in Data Base
  await Token.create({
    token: token,
    user: isUser.userName,
    userId: isUser._id,
    agent: req.headers["user-agent"],
  });

  return res.json({ success: true, results: { token } });
});

// 07-Change password (user must be logged in) =>Done
export const changePassword = asyncHandler(async (req, res, next) => {
  const checkUser = await User.findOne({ email: req.user.email });

  //  Hash Password
  const { newPasssowrd } = req.body;
  const hashPassword = bycryptjs.hashSync(newPasssowrd, 8);

  if (checkUser) {
    await User.findOneAndUpdate(
      { email: req.user.email },
      { password: hashPassword }
    );

    // response
    return res.json({
      success: true,
      message: "password changed Successfully",
    });
  }
});

// 08-update user (age , firstName , lastName)(user must be logged in) =>Done
export const updateUser = asyncHandler(async (req, res, next) => {
  //  Check User => Find User and Update Data
  const checkUser = await User.findOne({ email: req.user.email });
  if (checkUser) {
    await User.findOneAndUpdate(
      { email: req.user.email },
      { age: 28, userName: "firstNameAndSecondName" }
    );
    // Response
    return res.json({ success: true, message: "User updated successfully" });
  }
});

// 09-Delete User =>Done
export const deleteUser = asyncHandler(async (req, res, next) => {
  // Check User
  const checkUser = await User.findOne({ email: req.user.email });
  if (checkUser) {
    await User.findOneAndDelete({ email: req.user.email });
    return res.json({ success: true, message: "User Deleted Successfully" });
  } else {
    return next(new Error("Email is not Exist"));
  }
});

// 10-Soft Delete (User must be logged in)
export const softDelete = asyncHandler(async (req, res, next) => {});

// 11-Logout => Done
export const logout = asyncHandler(async (req, res) => {
  await Token.findOneAndUpdate(
    { userId: req.user.id.toString() },
    { isValid: false }
  );

  return res.json({ success: true, message: "user logged out" });
});
