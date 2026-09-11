// src/services/user.api.js
import api from "./api.js";

const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

const updateProfile = async ({ name }) => {
  const response = await api.put("/users/profile", { name });
  return response.data;
};

const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.put("/users/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export { getProfile, updateProfile, uploadAvatar };
