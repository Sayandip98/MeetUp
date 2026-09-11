import asyncHandler from "../utils/asyncHandler.js";
import {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
} from "../services/user.service.js";

const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await updateUserProfile(req.user._id, { name });

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("No file uploaded");
    error.statusCode = 400;
    throw error;
  }

  const user = await updateUserAvatar(req.user._id, req.file.buffer);

  res.status(200).json({
    success: true,
    data: {
      avatar: user.avatar,
    },
  });
});

export { getProfile, updateProfile, uploadAvatar };
