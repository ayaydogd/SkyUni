import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000'

function AnaSayfa() {
  const [kanallar, setKanallar] = useState([])
  const [yeniKanal, setYeniKanal] = useState('')
  const [secilenKanal, setSecilenKanal] = useState(null)
  const [mesajlar, setMesajlar] = useState([])
  const [yeniMesaj, setYeniMesaj] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/giris')
      return
    }
    kanallariGetir()
  }, [])

  const kanallariGetir = async () => {
    try {
      const res = await axios.get(`${API}/channels`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setKanallar(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const kanalOlustur = async () => {
    if (!yeniKanal) return
    try {
      await axios.post(`${API}/channels`, { name: yeniKanal }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setYeniKanal('')
      kanallariGetir()
    } catch (err) {
      console.log(err)
    }
  }

  const mesajlariGetir = async (kanal) => {
    setSecilenKanal(kanal)
    try {
      const res = await axios.get(`${API}/channels/${kanal._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMesajlar(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const mesajGonder = async () => {
    if (!yeniMesaj) return
    try {
      await axios.post(`${API}/channels/${secilenKanal._id}/messages`,
        { text: yeniMesaj },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setYeniMesaj('')
      mesajlariGetir(secilenKanal)
    } catch (err) {
      console.log(err)
    }
  }

  const cikisYap = () => {
    localStorage.removeItem('token')
    navigate('/giris')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sol panel - Kanallar */}
      <div style={{ width: '250px', backgroundColor: '#2c2c2c', color: 'white', padding: '1rem' }}>
        <h2>SkyUni 🎓</h2>
        <button onClick={cikisYap} style={{ width: '100%', padding: '8px', marginBottom: '1rem', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Çıkış Yap
        </button>
        <button onClick={() => navigate('/universiteler')} style={{ width: '100%', padding: '8px', marginBottom: '10px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            🏫 Üniversiteler
        </button>
        <button onClick={() => navigate('/profil')} style={{ width: '100%', padding: '8px', marginBottom: '10px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            👤 Profilim
        </button>
        <h3>Kanallar</h3>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <input
            placeholder="Yeni kanal..."
            value={yeniKanal}
            onChange={e => setYeniKanal(e.target.value)}
            style={{ flex: 1, padding: '5px' }}
          />
          <button onClick={kanalOlustur} style={{ padding: '5px 10px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+</button>
        </div>
        {kanallar.map(kanal => (
          <div
            key={kanal._id}
            onClick={() => mesajlariGetir(kanal)}
            style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px', backgroundColor: secilenKanal?._id === kanal._id ? '#646cff' : 'transparent', marginBottom: '4px' }}
          >
            # {kanal.name}
          </div>
        ))}
      </div>

      {/* Sağ panel - Mesajlar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
        {secilenKanal ? (
          <>
            <div style={{ padding: '1rem', backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
              <h3># {secilenKanal.name}</h3>
            </div>
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
              {mesajlar.map(mesaj => (
                <div key={mesaj._id} style={{ padding: '8px', marginBottom: '8px', backgroundColor: '#fff', borderRadius: '8px' }}>
                  <strong>{mesaj.userId?.username || 'Anonim'}</strong>
                  <p style={{ margin: '4px 0' }}>{mesaj.text}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#fff', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
              <input
                placeholder="Mesajınızı yazın..."
                value={yeniMesaj}
                onChange={e => setYeniMesaj(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && mesajGonder()}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <button onClick={mesajGonder} style={{ padding: '10px 20px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Gönder
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Bir kanal seçin 👈</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnaSayfa