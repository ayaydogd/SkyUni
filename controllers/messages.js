const Message = require('../models/Message')
const Channel = require('../models/Channel')

// 13. MESAJLARI LİSTELEME
const mesajlariListele = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const atla = (page - 1) * limit

    const kanal = await Channel.findById(req.params.channelId)
    if (!kanal) {
      return res.status(404).json({ message: 'Kanal bulunamadı.' })
    }

    const mesajlar = await Message.find({ channelId: req.params.channelId })
      .skip(atla)
      .limit(limit)
      .populate('userId', 'username avatarUrl')

    res.status(200).json(mesajlar)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 14. MESAJ GÖNDERME
const mesajGonder = async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ message: 'Mesaj boş olamaz.' })
    }

    const kanal = await Channel.findById(req.params.channelId)
    if (!kanal) {
      return res.status(404).json({ message: 'Kanal bulunamadı.' })
    }

    const yeniMesaj = new Message({
      text,
      channelId: req.params.channelId,
      userId: req.user.id
    })
    await yeniMesaj.save()

    res.status(201).json(yeniMesaj)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 15. MESAJ DÜZENLEME
const mesajDuzenle = async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ message: 'Mesaj boş olamaz.' })
    }

    const mesaj = await Message.findById(req.params.messageId)
    if (!mesaj) {
      return res.status(404).json({ message: 'Mesaj bulunamadı.' })
    }

    // Sadece kendi mesajını düzenleyebilir
    if (mesaj.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Sadece kendi mesajını düzenleyebilirsin.' })
    }

    mesaj.text = text
    await mesaj.save()

    res.status(200).json(mesaj)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 16. MESAJ SİLME
const mesajSil = async (req, res) => {
  try {
    const mesaj = await Message.findById(req.params.messageId)
    if (!mesaj) {
      return res.status(404).json({ message: 'Mesaj bulunamadı.' })
    }

    // Sadece kendi mesajını silebilir
    if (mesaj.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Sadece kendi mesajını silebilirsin.' })
    }

    await Message.findByIdAndDelete(req.params.messageId)
    res.status(204).send()

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

module.exports = { mesajlariListele, mesajGonder, mesajDuzenle, mesajSil }