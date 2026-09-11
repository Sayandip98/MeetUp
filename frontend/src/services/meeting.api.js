// src/services/meeting.api.js
import api from "./api.js";

const createMeeting = async ({ title }) => {
  const response = await api.post("/meetings", { title });
  return response.data;
};

const getMyMeetings = async () => {
  const response = await api.get("/meetings");
  return response.data;
};

const getMeetingByMeetingId = async (meetingId) => {
  const response = await api.get(`/meetings/${meetingId}`);
  return response.data;
};

export { createMeeting, getMyMeetings, getMeetingByMeetingId };
