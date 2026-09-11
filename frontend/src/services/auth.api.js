import api from "./api.js";

const register = async ({ name, email, password }) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

const login = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export { register, login };
