// src/utils/meetingUtils.js

const formatMeetingDuration = (startedAt) => {
  if (!startedAt) return "00:00";

  const diffMs = Date.now() - new Date(startedAt).getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const copyMeetingLink = (meetingId) => {
  const url = `${window.location.origin}/join?code=${meetingId}`;
  return navigator.clipboard.writeText(url);
};

export { formatMeetingDuration, copyMeetingLink };
