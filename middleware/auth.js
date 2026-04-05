const jwt = require('jsonwebtoken')

// Token kontrolü - giriş yapmış mı diye bakar
const tokenKontrol = (req, res, next) => {
  const authHeader = req.headers['authorization']

  // Token var mı?
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token eksik veya geçersiz.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Token doğru mu?
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token geçersiz.' })
  }
}

module.exports = tokenKontrol