import { Router } from "express";
import * as authController from "./auth.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import {
  forgetCodeSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../auth/auth.validationSchema.js";
import { uploadFileCloud } from "../../utiles/multer.js";

const router = Router();

// 01.01-sign up ( email must be unique )
router.post("/register", validation(signUpSchema), authController.signup);

// 01.02-Verification Link
router.get("/verificationLink/:token", authController.verificationLink);

// 02.01-forgetCode
router.patch(
  "/forgetCode",
  validation(forgetCodeSchema),
  authController.forgetCode
);

// 02.02-Reset Password
router.patch(
  "/resetPassword",
  validation(resetPasswordSchema),
  authController.resetPassword
);

// 03-Upload Profile Pic
router.post(
  "/profilePic",
  isAuthenticated,
  uploadFileCloud().single("pp"),
  authController.profilePic
);

// 04-Upload cover pics
router.post(
  "/coverPics",
  isAuthenticated,
  uploadFileCloud().array("coverPics", 3),
  authController.coverPics
);

// 05-Update Profile Pic
router.patch(
  "/updateProfilePic",
  isAuthenticated,
  uploadFileCloud().single("pp"),
  authController.updateProfilePic
);

// 06-sign in'
router.post("/login", validation(signInSchema), authController.logIn);

// 07-Change password (user must be logged in)
router.patch("/changePassword", isAuthenticated, authController.changePassword);

// 08-update user (age , firstName , lastName)(user must be logged in)
router.patch("/update", isAuthenticated, authController.updateUser);

// 09-Delete User (User must be logged in)
router.delete("/deleteUser", isAuthenticated, authController.deleteUser);

// 10-Soft Delete (User must be logged in)
router.post("/searchByAge", isAuthenticated, authController.softDelete);

// 11-Logout
router.patch("/logout", isAuthenticated, authController.logout);

export default router;
