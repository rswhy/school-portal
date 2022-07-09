const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: String,
  email: String,
  role: String,
  subject: Array,
  password: String,
})

module.exports = User 