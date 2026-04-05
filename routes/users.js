const express = require('express')
const router = express.Router()
const { profilGoruntule, profilGuncelle, hesapSil } = require('../controllers/users')
const tokenKontrol = require('../middleware/auth')

// 4. Profil Görüntüleme
router.get('/:userId', tokenKontrol, profilGoruntule)

// 5. Profil Güncelleme
router.put('/:userId', tokenKontrol, profilGuncelle)

// 6. Hesap Silme
router.delete('/:userId', tokenKontrol, hesapSil)

module.exports = router