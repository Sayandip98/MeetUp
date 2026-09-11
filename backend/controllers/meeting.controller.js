import asyncHandler from "../utils/asyncHandler.js";
import {
  createMeeting,
  getMeetingByMeetingId,
  getMeetingsByUser,
} from "../services/meeting.service.js";

const create = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const meeting = await createMeeting({
    title,
    hostId: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: meeting,
  });
});

const getByMeetingId = asyncHandler(async (req, res) => {
  const { meetingId } = req.params;

  const meeting = await getMeetingByMeetingId(meetingId);

  res.status(200).json({
    success: true,
    data: meeting,
  });
});

const getMyMeetings = asyncHandler(async (req, res) => {
  const meetings = await getMeetingsByUser(req.user._id);

  res.status(200).json({
    success: true,
    data: meetings,
  });
});

export { create, getByMeetingId, getMyMeetings };
