const rooms = new Map(); // meetingId -> Set of { socketId, userId, name }

const addParticipant = (meetingId, participant) => {
  if (!rooms.has(meetingId)) {
    rooms.set(meetingId, new Map());
  }
  rooms.get(meetingId).set(participant.socketId, participant);
};

const removeParticipant = (meetingId, socketId) => {
  if (!rooms.has(meetingId)) return;
  rooms.get(meetingId).delete(socketId);

  // clean up empty rooms so the Map doesn't grow forever
  if (rooms.get(meetingId).size === 0) {
    rooms.delete(meetingId);
  }
};

const getParticipants = (meetingId) => {
  if (!rooms.has(meetingId)) return [];
  return Array.from(rooms.get(meetingId).values());
};

export { addParticipant, removeParticipant, getParticipants };
