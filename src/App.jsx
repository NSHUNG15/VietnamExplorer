// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import MainLayout from './layouts/MainLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const ProvinceDetailPage = lazy(() => import('./pages/ProvinceDetailPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-3 text-center">
        <div className="w-10 h-10 mx-auto rounded-full border-2 border-jade-500/30 border-t-jade-500 animate-spin" />
        <p className="text-white/30 text-sm">Đang tải...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/province/:slug" element={<ProvinceDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-center">
              <div>
                <div className="text-6xl mb-4">🗺️</div>
                <h2 className="text-2xl font-display text-white mb-2">404 — Lạc đường rồi</h2>
                <a href="/" className="btn-primary inline-flex mt-4">Về trang chủ</a>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </MainLayout>
  )
}
