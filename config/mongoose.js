const mongoose = require('mongoose')
//use dot env if the current revironment is not under production
if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, 
useUnifiedTopology: true, useCreateIndex: true})
//get connection to the db
const db = mongoose.connection
//log connection abnormal
db.on('error', () => {
  console.log('mongodb error')
})
//log connection success
db.once('open', () => {
  console.log('mongodb connected')
})

module.exports = db