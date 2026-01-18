import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Transactions from './pages/Transactions'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
