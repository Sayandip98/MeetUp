// src/utils/validators.js
import { MEETING_ID_REGEX, PASSWORD_MIN_LENGTH } from "./constants.js";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= PASSWORD_MIN_LENGTH;
};

const isValidMeetingId = (meetingId) => {
  return MEETING_ID_REGEX.test(meetingId.trim());
};

export { isValidEmail, isValidPassword, isValidMeetingId };
