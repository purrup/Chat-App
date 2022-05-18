class WebSockets {
  connection(client) {
    // 使用者從前端頁面登入
    client.on("addUser", (userId) => {
      onlineUsers.set(userId, client.id);
    });
    // 傳送訊息
    client.on("sendMessage", (data) => {
      const receiverSocket = onlineUsers.get(data.receiver);
      // 將訊息透過事件傳送給接收者
      if(receiverSocket) client.to(receiverSocket).emit('messageReceived', data.message)
    });
  }
}
module.exports = new WebSockets();
