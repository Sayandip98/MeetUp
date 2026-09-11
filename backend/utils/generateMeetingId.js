const generateMeetingId = () => {
  const segment = () => Math.random().toString(36).substring(2, 6); // 4 random lowercase letters/numbers

  return `${segment()}-${segment()}-${segment()}`;
};

export default generateMeetingId;
