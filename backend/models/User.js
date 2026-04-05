const mongoose = require('mongoose')

const userSemasi = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  adSoyad: { type: String, default: '' },
  universite: { type: String, default: '' },
  kisaOzgecmis: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  basarimlar: { type: [String], default: [] }
}, { timestamps: true })

module.exports = mongoose.model('User', userSemasi)