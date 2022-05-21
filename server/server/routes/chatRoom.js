const express = require('express');
// controllers
const chatRoom = require('../controllers/chatRoom.js');
const router = express.Router();
router
  .post('/getMessage', chatRoom.getMessage)
  .post('/sendMessage', chatRoom.postMessage)
  .put('/:roomId/markRead', chatRoom.markConversationReadByRoomId)
module.exports = router;
