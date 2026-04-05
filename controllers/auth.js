const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// 1. KAYIT OLMA
const kayitOl = async (req, res) => {
  try {
    const { email, password, username } = req.body

    // Email, şifre ve kullanıcı adı var mı?
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, şifre ve kullanıcı adı zorunludur.' })
    }

    // Üniversite maili mi?
    if (!email.endsWith('.edu.tr') && !email.endsWith('.edu')) {
      return res.status(400).json({ message: 'Sadece üniversite e-postası (.edu.tr) kabul edilir.' })
    }

    // Öğrenci maili mi?
    const ogrenciKontrol = /ogr|ogrenci|std|stu|student/i.test(email)
    if (!ogrenciKontrol) {
      return res.status(400).json({ message: 'Sadece öğrenci e-postası kabul edilir.' })
    }

    // Şifre en az 8 karakter mi?
    if (password.length < 8) {
      return res.status(400).json({ message: 'Şifre en az 8 karakter olmalıdır.' })
    }

    // Bu email daha önce kayıtlı mı?
    const mevcutEmail = await User.findOne({ email })
    if (mevcutEmail) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı.' })
    }

    // Bu username daha önce alınmış mı?
    const mevcutUsername = await User.findOne({ username })
    if (mevcutUsername) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' })
    }

    // Şifreyi şifrele
    const sifreliSifre = await bcrypt.hash(password, 10)

    // Kullanıcıyı kaydet
    const yeniKullanici = new User({ email, password: sifreliSifre, username })
    await yeniKullanici.save()

    res.status(201).json({ message: 'Kayıt başarılı. Hesap oluşturuldu.' })

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 2. GİRİŞ YAPMA
const girisYap = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunludur.' })
    }

    const kullanici = await User.findOne({ email })
    if (!kullanici) {
      return res.status(401).json({ message: 'Hatalı email veya şifre.' })
    }

    const sifreDogruMu = await bcrypt.compare(password, kullanici.password)
    if (!sifreDogruMu) {
      return res.status(401).json({ message: 'Hatalı email veya şifre.' })
    }

    const token = jwt.sign(
      { id: kullanici._id, email: kullanici.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({ message: 'Giriş başarılı.', token })

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 3. ÇIKIŞ YAPMA
const cikisYap = async (req, res) => {
  res.status(200).json({ message: 'Başarıyla çıkış yapıldı. Oturum sonlandırıldı.' })
}

module.exports = { kayitOl, girisYap, cikisYap }