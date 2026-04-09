require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const universityRoutes = require('./routes/universities')
const channelRoutes = require('./routes/channels')
const messageRoutes = require('./routes/messages')

const app = express()

const allowedOrigins = [
  'https://skyini-frontend.onrender.com',
  'http://localhost:5173'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS: izin verilmeyen origin'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/universities', universityRoutes)
app.use('/channels', channelRoutes)
app.use('/messages', messageRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı ✅'))
  .catch((err) => console.log('MongoDB bağlantı hatası ❌', err))

app.get('/', (req, res) => {
  res.json({ mesaj: 'SkyUni API çalışıyor 🚀' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Aygül ${PORT} portunda dinlemede 🌐`)
})