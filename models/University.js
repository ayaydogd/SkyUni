const mongoose = require('mongoose')

const universitySemasi = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  website: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('University', universitySemasi)