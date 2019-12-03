var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  following: {type: Array},
  trucks:  {type: Array},
  comments:  {type: Array}
})

module.exports = mongoose.model('User', userSchema)
