const express = require('express')
const router = express.Router()
const { kanallariListele, kanalOlustur, kanalSil } = require('../controllers/channels')
const { mesajlariListele, mesajGonder, mesajDuzenle, mesajSil } = require('../controllers/messages')
const tokenKontrol = require('../middleware/auth')
const contentFilter = require('../middleware/contentFilter')

// 10. Kanalları Listeleme
router.get('/', tokenKontrol, kanallariListele)

// 11. Kanal Oluşturma
router.post('/', tokenKontrol, kanalOlustur)

// 12. Kanal Silme
router.delete('/:channelId', tokenKontrol, kanalSil)

// 13. Mesajları Listeleme
router.get('/:channelId/messages', tokenKontrol, mesajlariListele)

// 14. Mesaj Gönderme (içerik filtresi var!)
router.post('/:channelId/messages', tokenKontrol, contentFilter, mesajGonder)

module.exports = router