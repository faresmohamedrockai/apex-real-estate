const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // ✅ التصحيح هنا كمان spelling
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});


const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
