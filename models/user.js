const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (field) => validator.isEmail(field),
      message: 'Некорректный формат почты',
    },
  },
  password: {
    type: String,
    requred: true,
  },
});

module.exports = mongoose.model('user', userSchema);
