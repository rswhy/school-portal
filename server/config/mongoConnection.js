const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://ratihsanjayaw:${process.env.DBPASS}@cluster0.qtgtz.mongodb.net/school`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});