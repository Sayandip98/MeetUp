import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.route("/profile").get(protect, getProfile).put(protect, updateProfile);
router
  .route("/profile/avatar")
  .put(protect, upload.single("avatar"), uploadAvatar);

export default router;
