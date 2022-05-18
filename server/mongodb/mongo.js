const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_NAME;

const CONNECTION_URL = `mongodb://${dbUrl}/${dbName}`

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
