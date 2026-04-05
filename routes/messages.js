const express = require('express')
const router = express.Router()
const { mesajDuzenle, mesajSil } = require('../controllers/messages')
const tokenKontrol = require('../middleware/auth')
const contentFilter = require('../middleware/contentFilter')

// 15. Mesaj Düzenleme (içerik filtresi var!)
router.put('/:messageId', tokenKontrol, contentFilter, mesajDuzenle)

// 16. Mesaj Silme
router.delete('/:messageId', tokenKontrol, mesajSil)

module.exports = router