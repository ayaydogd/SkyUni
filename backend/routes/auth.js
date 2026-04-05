const express = require('express')
const router = express.Router()
const { kayitOl, girisYap, cikisYap } = require('../controllers/auth')
const tokenKontrol = require('../middleware/auth')

// 1. Kayıt Olma
router.post('/register', kayitOl)

// 2. Giriş Yapma
router.post('/login', girisYap)

// 3. Çıkış Yapma (token gerekli)
router.post('/logout', tokenKontrol, cikisYap)

module.exports = router