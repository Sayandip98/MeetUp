// server/routes/meeting.routes.js
import { Router } from "express";
import {
  create,
  getByMeetingId,
  getMyMeetings,
} from "../controllers/meeting.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(protect, create).get(protect, getMyMeetings);
router.route("/:meetingId").get(protect, getByMeetingId);

export default router;
