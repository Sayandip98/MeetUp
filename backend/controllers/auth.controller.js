import asyncHandler from "../utils/asyncHandler.js";
import { registerUser, loginUser } from "../services/auth.service.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are all required");
    error.statusCode = 400;
    throw error;
  }

  const result = await registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const result = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export { register, login };