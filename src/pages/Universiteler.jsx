import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://sky-uni-df3v-git-main-ayguls-projects-729fa65b.vercel.app'

function Universiteler() {
  const [universiteler, setUniversiteler] = useState([])
  const [yeniUni, setYeniUni] = useState('')
  const [yeniWebsite, setYeniWebsite] = useState('')
  const [secilenUni, setSecilenUni] = useState(null)
  const [hocalar, setHocalar] = useState([])
  const [dersler, setDersler] = useState([])
  const [yeniHoca, setYeniHoca] = useState('')
  const [yeniHocaBolum, setYeniHocaBolum] = useState('')
  const [yeniDersKod, setYeniDersKod] = useState('')
  const [yeniDersAd, setYeniDersAd] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { navigate('/giris'); return }
    universiteleriGetir()
  }, [])

  const universiteleriGetir = async () => {
    try {
      const res = await axios.get(`${API}/universities`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUniversiteler(res.data)
    } catch (err) { console.log(err) }
  }

  const universiteEkle = async () => {
    if (!yeniUni) return
    try {
      await axios.post(`${API}/universities`, { name: yeniUni, website: yeniWebsite }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setYeniUni('')
      setYeniWebsite('')
      universiteleriGetir()
    } catch (err) { console.log(err) }
  }

  const universiteSec = async (uni) => {
    setSecilenUni(uni)
    try {
      const hocaRes = await axios.get(`${API}/universities/${uni._id}/professors`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const dersRes = await axios.get(`${API}/universities/${uni._id}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHocalar(hocaRes.data)
      setDersler(dersRes.data)
    } catch (err) { console.log(err) }
  }

  const hocaEkle = async () => {
    if (!yeniHoca || !secilenUni) return
    try {
      await axios.post(`${API}/universities/${secilenUni._id}/professors`,
        { name: yeniHoca, department: yeniHocaBolum },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setYeniHoca('')
      setYeniHocaBolum('')
      universiteSec(secilenUni)
    } catch (err) { console.log(err) }
  }

  const dersEkle = async () => {
    if (!yeniDersKod || !yeniDersAd || !secilenUni) return
    try {
      await axios.post(`${API}/universities/${secilenUni._id}/courses`,
        { code: yeniDersKod, name: yeniDersAd },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setYeniDersKod('')
      setYeniDersAd('')
      universiteSec(secilenUni)
    } catch (err) { console.log(err) }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: '250px', backgroundColor: '#2c2c2c', color: 'white', padding: '1rem', overflowY: 'auto' }}>
        <h2>🎓 SkyUni</h2>
        <button onClick={() => navigate('/')} style={{ width: '100%', padding: '8px', marginBottom: '10px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          ← Ana Sayfa
        </button>
        <h3>Üniversite Ekle</h3>
        <input placeholder="Üniversite adı" value={yeniUni} onChange={e => setYeniUni(e.target.value)} style={{ width: '100%', padding: '5px', marginBottom: '5px' }} />
        <input placeholder="Website" value={yeniWebsite} onChange={e => setYeniWebsite(e.target.value)} style={{ width: '100%', padding: '5px', marginBottom: '5px' }} />
        <button onClick={universiteEkle} style={{ width: '100%', padding: '8px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '15px' }}>
          + Ekle
        </button>
        <h3>Üniversiteler</h3>
        {universiteler.map(uni => (
          <div key={uni._id} onClick={() => universiteSec(uni)} style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px', backgroundColor: secilenUni?._id === uni._id ? '#646cff' : 'transparent', marginBottom: '4px' }}>
            🏫 {uni.name}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#000000', overflowY: 'auto' }}>
        {secilenUni ? (
          <>
            <h2>{secilenUni.name}</h2>
            {secilenUni.website && <a href={secilenUni.website} target="_blank">{secilenUni.website}</a>}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              <div style={{ flex: 1 }}>
                <h3>👨‍🏫 Hocalar</h3>
                <input placeholder="Hoca adı" value={yeniHoca} onChange={e => setYeniHoca(e.target.value)} style={{ width: '100%', padding: '5px', marginBottom: '5px' }} />
                <input placeholder="Bölüm" value={yeniHocaBolum} onChange={e => setYeniHocaBolum(e.target.value)} style={{ width: '100%', padding: '5px', marginBottom: '5px' }} />
                <button onClick={hocaEkle} style={{ width: '100%', padding: '8px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' }}>
                  + Hoca Ekle
                </button>
                {hocalar.length === 0 ? <p>Henüz hoca eklenmemiş.</p> : hocalar.map(h => (
                  <div key={h._id} style={{ padding: '8px', backgroundColor: '#000000', borderRadius: '8px', marginBottom: '8px' }}>
                    {h.name} - {h.department}
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <h3>📚 Dersler</h3>
                <input placeholder="Ders kodu" value={yeniDersKod} onChange={e => setYeniDersKod(e.target.value)} style={{ width: '100%', padding: '5px', marginBottom: '5px' }} />
                <input placeholder="Ders adı" value={yeniDersAd} onChange={e => setYeniDersAd(e.target.value)} style={{ width: '100%', padding: '5px', marginBottom: '5px' }} />
                <button onClick={dersEkle} style={{ width: '100%', padding: '8px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' }}>
                  + Ders Ekle
                </button>
                {dersler.length === 0 ? <p>Henüz ders eklenmemiş.</p> : dersler.map(d => (
                  <div key={d._id} style={{ padding: '8px', backgroundColor: '#000000', borderRadius: '8px', marginBottom: '8px' }}>
                    {d.code} - {d.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p>Bir üniversite seçin 👈</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Universiteler