// src/pages/FavoritesPage.jsx
import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { useAppStore } from '../store'
import { useProvinces } from '../hooks/useProvinces'
import ProvinceCard from '../components/province/ProvinceCard'

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useAppStore()
  const { data: allProvinces = [] } = useProvinces()

  const favoriteProvinces = allProvinces.filter((p) => favorites.includes(p.id))

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart size={16} className="text-red-400 fill-red-400" />
            <span className="text-red-400 text-sm tracking-widest uppercase">Yêu thích</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">
            Danh sách <span className="text-red-400">yêu thích</span>
          </h1>
          <p className="text-white/50">
            {favoriteProvinces.length} địa điểm đã lưu
          </p>
        </motion.div>

        {favoriteProvinces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Heart size={60} className="mx-auto text-white/10 mb-4" />
            <h3 className="text-white/50 text-xl mb-2">Chưa có địa điểm yêu thích</h3>
            <p className="text-white/30 text-sm">Nhấn vào biểu tượng ❤️ để lưu địa điểm yêu thích</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favoriteProvinces.map((province, i) => (
              <ProvinceCard key={province.id} province={province} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
