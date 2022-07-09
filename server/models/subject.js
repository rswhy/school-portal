const mongoose = require('mongoose');

const Subject = mongoose.model('Subject', {
  name: String,
  student: Array
})

module.exports = Subject 