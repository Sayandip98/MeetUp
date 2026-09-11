import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    meeting: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
