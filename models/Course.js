const mongoose = require('mongoose')

const courseSemasi = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true }
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSemasi)