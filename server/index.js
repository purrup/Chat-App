const express = require('express');
const logger = require('morgan');
const path = require('path')
const cors = require('cors');
const socketio = require('socket.io');
require('dotenv').config();
// mongo connection
require("./mongodb/mongo.js");
// socket configuration
const WebSockets = require("./socket/websocket.js");
// routes
const indexRouter = require("./routes/index.js");
const userRouter = require("./routes/user.js");
const chatRoomRouter = require("./routes/chatRoom.js");
const deleteRouter = require("./routes/delete.js");
// 驗證 token
const { decode } = require('./auth/jwt.js');
const app = express();
/** Get port from environment and store in Express. */
const port = process.env.PORT || "5000";
app.set("port", port);
// express 設定
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 前端打包
app.use(express.static(path.join(__dirname, 'public')));
// Route
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);
// catch 404 and forward to error handler
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint does not exist'
  })
});
const server = app.listen(port, () =>
  console.log(`Listening on port:: http://localhost:${port}/`)
);
// 用來儲存在線使用者的 dictionary 物件
global.onlineUsers = new Map();
// create socket object and set CORS｀
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
io.on('connection', WebSockets.connection)
