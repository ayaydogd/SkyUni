import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

function KayitOl() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [username, setUsername] = useState('')
  const [hata, setHata] = useState('')
  const [basari, setBasari] = useState('')
  const navigate = useNavigate()

  const kayitOl = async () => {
    try {
      await axios.post(`${API}/auth/register`, {
        email,
        password: sifre,
        username
      })
      setBasari('Kayıt başarılı! Giriş yapabilirsiniz.')
      setTimeout(() => navigate('/giris'), 2000)
    } catch (err) {
      setHata(err.response?.data?.message || 'Kayıt başarısız.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>SkyUni - Kayıt Ol</h2>
      {hata && <p style={{ color: 'red' }}>{hata}</p>}
      {basari && <p style={{ color: 'green' }}>{basari}</p>}
      <input
        type="text"
        placeholder="Kullanıcı adınız (anonim)"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        type="email"
        placeholder="Üniversite e-postanız (.edu.tr)"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Şifreniz (min 8 karakter)"
        value={sifre}
        onChange={e => setSifre(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <p style={{ fontSize: '12px', color: '#888' }}>
        ⚠️ Sadece üniversite e-postası (.edu.tr) kabul edilir.
      </p>
      <button onClick={kayitOl} style={{ width: '100%', padding: '10px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Kayıt Ol
      </button>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Zaten hesabın var mı? <a href="/giris">Giriş Yap</a>
      </p>
    </div>
  )
}

export default KayitOl