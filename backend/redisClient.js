const Redis = require('ioredis')

// Tek bir Redis bağlantısı (uygulama genelinde paylaşılır)
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  // Bağlantı kopsa bile uygulamayı çökertme; yeniden denemeyi sınırla
  maxRetriesPerRequest: 2,
  lazyConnect: false
})

redis.on('connect', () => {
  console.log('Redis bağlantısı başarılı ✅')
})

// Hata loglama: Redis düşse bile uygulama çalışmaya devam etsin
redis.on('error', (err) => {
  console.log('Redis hatası ❌', err.message)
})

module.exports = redis
