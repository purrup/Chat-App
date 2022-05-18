const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');
const uri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URL : "mongodb://localhost:27017/chat-app"
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})

mongoose.connection.on('connected', () => {
  console.log('Mongo has connected successfully')
})
mongoose.connection.on('reconnected', () => {
  console.log('Mongo has reconnected')
})
mongoose.connection.on('error', error => {
  console.log('Mongo connection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongo connection is disconnected')
})

module.exports = mongoose;
