import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    meetingId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: "Untitled Meeting",
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
        },
        leftAt: {
          type: Date,
        },
      },
    ],
    status: {
      type: String,
      enum: ["scheduled", "active", "ended"],
      default: "scheduled",
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
