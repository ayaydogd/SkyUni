const Channel = require('../models/Channel')

// 10. KANALLARI LİSTELEME
const kanallariListele = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const atla = (page - 1) * limit

    const kanallar = await Channel.find().skip(atla).limit(limit)
    res.status(200).json(kanallar)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 11. KANAL OLUŞTURMA
const kanalOlustur = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Kanal adı zorunludur.' })
    }

    const yeniKanal = new Channel({ name, description })
    await yeniKanal.save()

    res.status(201).json(yeniKanal)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 12. KANAL SİLME
const kanalSil = async (req, res) => {
  try {
    const silinen = await Channel.findByIdAndDelete(req.params.channelId)

    if (!silinen) {
      return res.status(404).json({ message: 'Kanal bulunamadı.' })
    }

    res.status(204).send()

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

module.exports = { kanallariListele, kanalOlustur, kanalSil }