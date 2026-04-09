import { HashRouter, Routes, Route } from 'react-router-dom'
import GirisYap from './pages/GirisYap'
import KayitOl from './pages/KayitOl'
import AnaSayfa from './pages/AnaSayfa'
import Profil from './pages/Profil'
import Universiteler from './pages/Universiteler'


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/giris" element={<GirisYap />} />
        <Route path="/kayit" element={<KayitOl />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/universiteler" element={<Universiteler />} />
      </Routes>
    </HashRouter>
  )
}

export default App