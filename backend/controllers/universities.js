const University = require('../models/University')
const Professor = require('../models/Professor')
const Course = require('../models/Course')

// 7. ÜNİVERSİTELERİ LİSTELEME
const universiteleriListele = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const atla = (page - 1) * limit

    const universiteler = await University.find().skip(atla).limit(limit)
    res.status(200).json(universiteler)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 8. ÜNİVERSİTE EKLEME
const universiteEkle = async (req, res) => {
  try {
    const { name, website } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Üniversite adı zorunludur.' })
    }

    if (name.length < 3) {
      return res.status(400).json({ message: 'Üniversite adı en az 3 karakter olmalıdır.' })
    }

    const yeniUniveriste = new University({ name, website })
    await yeniUniveriste.save()

    res.status(201).json(yeniUniveriste)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 9. ÜNİVERSİTE SİLME
const universiteSil = async (req, res) => {
  try {
    const silinen = await University.findByIdAndDelete(req.params.universityId)

    if (!silinen) {
      return res.status(404).json({ message: 'Üniversite bulunamadı.' })
    }

    res.status(204).send()

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 17. HOCALARI LİSTELEME
const hocalariListele = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const atla = (page - 1) * limit

    const universite = await University.findById(req.params.universityId)
    if (!universite) {
      return res.status(404).json({ message: 'Üniversite bulunamadı.' })
    }

    const hocalar = await Professor.find({ universityId: req.params.universityId })
      .skip(atla).limit(limit)

    res.status(200).json(hocalar)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 18. HOCA EKLEME
const hocaEkle = async (req, res) => {
  try {
    const { name, department } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Hoca adı zorunludur.' })
    }

    const universite = await University.findById(req.params.universityId)
    if (!universite) {
      return res.status(404).json({ message: 'Üniversite bulunamadı.' })
    }

    const yeniHoca = new Professor({
      name,
      department,
      universityId: req.params.universityId
    })
    await yeniHoca.save()

    res.status(201).json(yeniHoca)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 19. DERSLERİ LİSTELEME
const dersleriListele = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const atla = (page - 1) * limit

    const universite = await University.findById(req.params.universityId)
    if (!universite) {
      return res.status(404).json({ message: 'Üniversite bulunamadı.' })
    }

    const dersler = await Course.find({ universityId: req.params.universityId })
      .skip(atla).limit(limit)

    res.status(200).json(dersler)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

// 20. DERS EKLEME
const dersEkle = async (req, res) => {
  try {
    const { code, name } = req.body

    if (!code || !name) {
      return res.status(400).json({ message: 'Ders kodu ve adı zorunludur.' })
    }

    const universite = await University.findById(req.params.universityId)
    if (!universite) {
      return res.status(404).json({ message: 'Üniversite bulunamadı.' })
    }

    const yeniDers = new Course({
      code,
      name,
      universityId: req.params.universityId
    })
    await yeniDers.save()

    res.status(201).json(yeniDers)

  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.', hata: err.message })
  }
}

module.exports = {
  universiteleriListele,
  universiteEkle,
  universiteSil,
  hocalariListele,
  hocaEkle,
  dersleriListele,
  dersEkle
}