// src/layouts/MainLayout.jsx
import Navbar from '../components/shared/Navbar'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#080c14]">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
