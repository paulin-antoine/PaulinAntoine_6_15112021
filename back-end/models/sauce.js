const mongoose = require('mongoose');

const saucesSchema = mongoose.Schema({
  sauce: { type: String, required: true },
  image: { type: String, required: true}
});

module.exports = mongoose.model('Sauce', saucesSchema);