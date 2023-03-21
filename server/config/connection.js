const mongoose = require('mongoose');
// var dburl = "mongodb://127.0.0.1:27017";
//process.env.MONGODB_URI
mongoose.connect( process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

module.exports = mongoose.connection;
