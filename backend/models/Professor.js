const mongoose = require('mongoose')

const professorSemasi = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  department: { type: String, default: '' },
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true }
}, { timestamps: true })

module.exports = mongoose.model('Professor', professorSemasi)