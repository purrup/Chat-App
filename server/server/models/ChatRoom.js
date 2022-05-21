const mongoose = require("mongoose");
const chatRoomSchema = new mongoose.Schema(
  {
  members: {
      type: Array,
      unique: true
    },
    // 聊天室發起人
    chatInitiator: String,
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);