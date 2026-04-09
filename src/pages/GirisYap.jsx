import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL

function GirisYap() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [hata, setHata] = useState('')
  const navigate = useNavigate()

  const girisYap = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password: sifre
      })
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      setHata(err.response?.data?.message || 'Giriş başarısız.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>SkyUni - Giriş Yap</h2>
      {hata && <p style={{ color: 'red' }}>{hata}</p>}
      <input
        type="email"
        placeholder="Üniversite e-postanız"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Şifreniz"
        value={sifre}
        onChange={e => setSifre(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={girisYap} style={{ width: '100%', padding: '10px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Giriş Yap
      </button>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Hesabın yok mu? <Link to="/kayit">Kayıt Ol</Link>
      </p>
    </div>
  )
}

export default GirisYap