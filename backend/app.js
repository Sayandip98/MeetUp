import express from "express";
import cors from "cors";

// middleware import
import errorMiddleware from "./middleware/error.middleware.js";
import {
  apiLimiter,
  authLimiter,
} from "./middleware/rateLimiter.middleware.js";

// import router
import authRoutes from "./routes/auth.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// --- Core middleware ---
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
//app.use(cors());
app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check route (proves the server is alive) ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// router use
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);

app.use(errorMiddleware);

export default app;
