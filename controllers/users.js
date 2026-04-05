const User = require('../models/User')
const bcrypt = require('bcryptjs')

// 4. PROFİL BİLGİLERİNİ GÖRÜNTÜLEME
const profilGoruntule = async (req, res) => {
  try {
    const kullanici = await User.findById(req.params.userId).select('-password')

    if (!kullanici) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' })
    }

    res.status(200).json(kullanici)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 5. PROFİL BİLGİLERİNİ GÜNCELLEME
const profilGuncelle = async (req, res) => {
  try {
    // Sadece kendi profilini güncelleyebilir
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Sadece kendi profilini güncelleyebilirsin.' })
    }

    const { kisaOzgecmis, avatarUrl, password } = req.body
    const guncellenecekler = {}

    if (kisaOzgecmis) guncellenecekler.kisaOzgecmis = kisaOzgecmis
    if (avatarUrl) guncellenecekler.avatarUrl = avatarUrl
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Şifre en az 8 karakter olmalıdır.' })
      }
      guncellenecekler.password = await bcrypt.hash(password, 10)
    }

    const guncellenmisKullanici = await User.findByIdAndUpdate(
      req.params.userId,
      guncellenecekler,
      { new: true }
    ).select('-password')

    if (!guncellenmisKullanici) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' })
    }

    res.status(200).json(guncellenmisKullanici)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 6. HESABI SİLME
const hesapSil = async (req, res) => {
  try {
    // Sadece kendi hesabını silebilir
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Sadece kendi hesabını silebilirsin.' })
    }

    const silinen = await User.findByIdAndDelete(req.params.userId)

    if (!silinen) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' })
    }

    res.status(204).send()

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

module.exports = { profilGoruntule, profilGuncelle, hesapSil }