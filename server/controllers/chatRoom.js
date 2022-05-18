const mongoose = require('mongoose');
// 驗證前端資料用的物件
const ajv = new (require("ajv"))({allErrors: true});
// 客製錯誤訊息的物件
require("ajv-errors")(ajv);
// models
const ChatRoomModel = require('../models/ChatRoom.js');
const ChatMessageModel = require('../models/ChatMessage.js');
const UserModel = require('../models/User.js');

module.exports = {
  // 傳送一則訊息至聊天室
  postMessage: async (req, res) => {
    try {
      // 建立驗證前端傳入的新增訊息資料的物件
      const validation = verifyMessage(req.body);
      const verifyResult = validation(req.body);
      // 驗證失敗，回傳錯誤訊息
      if (!verifyResult) return res.status(400).json({ result: false, errors: validation.errors });
      const { sender, receiver, message } = req.body;
      const data = await ChatMessageModel.create({
        message: message,
        users: [sender._id, receiver],
        sender: mongoose.Types.ObjectId(sender._id),
      });
      if (data) return res.json({ result: true, message: "Message added successfully." });
      else return res.json({ result: false, error: "Failed to add message to the database" });
    } catch (error) {
      return res.status(500).json({ result: false, error: error.message })
    }
   },
  
  // 查詢訊息
  getMessage: async (req, res) => {
    try {
      const { sender, receiver } = req.body;
      const messages = await ChatMessageModel.find({
        users: { $all: [ sender._id, receiver ] }
      }).sort({ createdAt: 1});
      const data = messages.map((message) => {
        return {
          // Boolean, 是否為當前使用者發送的訊息
          fromSelf: message.sender.toString() === sender._id,
          // 訊息內容
          message: message.message
        }
      })
      res.status(200).json({ result: true, message: data})
    } catch (error) {
      return res.status(500).json({ result: false, error: error.message });
    }
   },
  
  // 標記聊天室訊息為已讀
  markConversationReadByRoomId: async (req, res) => { 
    try {
      // 取得聊天室編號
      // 查詢聊天室
      // 取得使用者編號
      // 執行標記訊息
      // 回傳執行結果
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  },
}

/**
 * 建立驗證前端傳入的新增訊息資料的物件
 * @param {Object} requestBody 前端傳入的 Request
 * @returns 回傳用來驗證的物件
 */
 const verifyMessage = (requestBody) => {
  const { sender, receiver, message } = requestBody;
    // 設定要驗證前端傳來資料的欄位
    return ajv.compile({
      type: "object",
      properties: {
        sender: { type: "object", nullable: false },
        receiver: { type: "array", nullable: false },
        message: { type: "string", nullable: false }
      },
      required: ["sender", "receiver", "message"],
      errorMessage: {
        type: "傳入資料不是 Object", 
        properties: { 
          sender: `接收到傳送者: [${sender}]，傳送者須為使用者物件，不得為 null。`,
          receiver: `接收到接收者為: [${receiver}]，訊息傳送者須為陣列，不得為 null。`,
          message: `接收到訊息內容為: [${message}]，訊息內容須為字串，不得為null。`
        },
      },
    });
}
