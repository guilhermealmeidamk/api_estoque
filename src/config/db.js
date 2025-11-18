const mongoose = require('mongoose');

function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/estoque';
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectDB;
