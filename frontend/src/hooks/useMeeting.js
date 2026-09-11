// src/hooks/useMeeting.js
import { useContext } from "react";
import { MeetingContext } from "../context/MeetingContext.jsx";

const useMeeting = () => useContext(MeetingContext);

export default useMeeting;
