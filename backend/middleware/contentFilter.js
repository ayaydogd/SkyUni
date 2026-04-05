// Yasaklı kelimeler listesi
const yasakliKelimeler = [
  // Ölüm ve şiddet
  'öldür', 'öldüreceğim', 'öldüreyim', 'katil', 'katletmek',
  'gebertmek', 'geberirim', 'canına kıyarım', 'seni bitiririm',
  'vuracağım', 'bıçaklarım', 'yakacağım', 'bomba',

  // Tehdit
  'seni bulurum', 'adresini bilirim', 'pişman ederim',
  'hesabını sorarım', 'kötü olur', 'zarar veririm',

  // Hakaret
  'aptal', 'salak', 'gerizekalı', 'mal', 'dangalak',
  'ahmak', 'budala', 'göt', 'orospu', 'piç',

  // İngilizce
  'kill', 'murder', 'die', 'death threat', 'idiot', 'stupid'
]

// Metni kontrol et
const icerikKontrol = (req, res, next) => {
  const { text } = req.body

  if (!text) return next()

  const kucukMetin = text.toLowerCase()

  const yasakliKelimeBulundu = yasakliKelimeler.some(kelime =>
    kucukMetin.includes(kelime.toLowerCase())
  )

  if (yasakliKelimeBulundu) {
    return res.status(400).json({
      message: 'Mesajınız uygunsuz içerik barındırmaktadır. Lütfen topluluk kurallarına uyunuz.'
    })
  }

  next()
}

module.exports = icerikKontrol