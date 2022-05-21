const mongoose = require("mongoose");

// 已讀訊息 Schema
const readByReceiversSchema = new mongoose.Schema(
  {
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

// 訊息 Schema
const chatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: { type: String },
    message: { type: String, required: true },
    users: { type: Array, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    readByReceivers: [readByReceiversSchema],
  },
  {
    timestamps: true,
    collection: "chatMessages",
  }
);

// 標記聊天室的訊息為己讀
chatMessageSchema.statics.markMessageRead = async function (chatRoomId, currentUserOnlineId) {
  try {
    // 一次可更新聊天室中多筆訊息的資料
    return this.updateMany(
      {
        // 查詢聊天室的訊息裡，沒有被當前使用者已讀的訊息
        chatRoomId,
        'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
      },
      {
        // 將當前使用者加入已讀的使用者中
        $addToSet: {
          readByRecipients: { readByUserId: currentUserOnlineId }
        }
      },
      {
        // update 所有查詢到的訊息
        multi: true
      }
    );
  } catch (error) {
    throw error;
  }
}

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
