const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthday: { type: String, required: true }
});

module.exports = mongoose.model('user', userSchema);
