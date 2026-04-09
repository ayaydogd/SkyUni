import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

function Profil() {
  const [profil, setProfil] = useState(null)
  const [kisaOzgecmis, setKisaOzgecmis] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [basari, setBasari] = useState('')
  const [hata, setHata] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { navigate('/giris'); return }
    profilGetir()
  }, [])

  const profilGetir = async () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const res = await axios.get(`${API}/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfil(res.data)
      setKisaOzgecmis(res.data.kisaOzgecmis || '')
      setAvatarUrl(res.data.avatarUrl || '')
    } catch (err) { console.log(err) }
  }

  const profilGuncelle = async () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      await axios.put(`${API}/users/${decoded.id}`,
        { kisaOzgecmis, avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBasari('Profil güncellendi!')
      profilGetir()
    } catch (err) {
      setHata(err.response?.data?.message || 'Güncelleme başarısız.')
    }
  }

  if (!profil) return <p>Yükleniyor...</p>

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '1rem', padding: '8px 16px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        ← Ana Sayfa
      </button>
      <h2>👤 Profilim</h2>
      <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        {profil.avatarUrl && <img src={profil.avatarUrl} alt="avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px' }} />}
        <p><strong>Kullanıcı Adı:</strong> {profil.username}</p>
        <p><strong>Email:</strong> {profil.email}</p>
        <p><strong>Üniversite:</strong> {profil.universite || 'Belirtilmemiş'}</p>
        <p><strong>Hakkında:</strong> {profil.kisaOzgecmis || 'Belirtilmemiş'}</p>
      </div>

      <h3>Profili Güncelle</h3>
      {basari && <p style={{ color: 'green' }}>{basari}</p>}
      {hata && <p style={{ color: 'red' }}>{hata}</p>}
      <textarea
        placeholder="Hakkında..."
        value={kisaOzgecmis}
        onChange={e => setKisaOzgecmis(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '80px' }}
      />
      <input
        placeholder="Avatar URL"
        value={avatarUrl}
        onChange={e => setAvatarUrl(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={profilGuncelle} style={{ width: '100%', padding: '10px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Güncelle
      </button>
    </div>
  )
}

export default Profil