import Meeting from "../models/Meeting.model.js";
import generateMeetingId from "../utils/generateMeetingId.js";

const createMeeting = async ({ title, hostId }) => {
  const meetingId = generateMeetingId();

  const meeting = await Meeting.create({
    meetingId,
    title,
    host: hostId,
  });

  return meeting;
};

const getMeetingByMeetingId = async (meetingId) => {
  const meeting = await Meeting.findOne({ meetingId }).populate(
    "host",
    "name email",
  );

  if (!meeting) {
    const error = new Error("Meeting not found");
    error.statusCode = 404;
    throw error;
  }

  return meeting;
};

const getMeetingsByUser = async (userId) => {
  const meetings = await Meeting.find({ host: userId }).sort({
    createdAt: -1,
  });

  return meetings;
};

export { createMeeting, getMeetingByMeetingId, getMeetingsByUser };
