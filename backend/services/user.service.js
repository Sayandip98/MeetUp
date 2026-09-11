import User from "../models/User.model.js";
import cloudinary from "../config/cloudinary.js";

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const updateUserProfile = async (userId, { name }) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (name) user.name = name;

  await user.save();
  return user;
};

const updateUserAvatar = async (userId, fileBuffer) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // upload_stream needs to be wrapped in a Promise since it uses callbacks
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "meetup/avatars" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(fileBuffer);
  });

  user.avatar = {
    url: uploadResult.secure_url,
    filename: uploadResult.public_id,
  };

  await user.save();
  return user;
};

export { getUserProfile, updateUserProfile, updateUserAvatar };
