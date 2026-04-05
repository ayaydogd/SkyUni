const express = require('express')
const router = express.Router()
const {
  universiteleriListele,
  universiteEkle,
  universiteSil,
  hocalariListele,
  hocaEkle,
  dersleriListele,
  dersEkle
} = require('../controllers/universities')
const tokenKontrol = require('../middleware/auth')

// 7. Üniversiteleri Listeleme
router.get('/', tokenKontrol, universiteleriListele)

// 8. Üniversite Ekleme
router.post('/', tokenKontrol, universiteEkle)

// 9. Üniversite Silme
router.delete('/:universityId', tokenKontrol, universiteSil)

// 17. Hocaları Listeleme
router.get('/:universityId/professors', tokenKontrol, hocalariListele)

// 18. Hoca Ekleme
router.post('/:universityId/professors', tokenKontrol, hocaEkle)

// 19. Dersleri Listeleme
router.get('/:universityId/courses', tokenKontrol, dersleriListele)

// 20. Ders Ekleme
router.post('/:universityId/courses', tokenKontrol, dersEkle)

module.exports = router