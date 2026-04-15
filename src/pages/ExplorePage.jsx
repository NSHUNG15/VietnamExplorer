// src/pages/ExplorePage.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, SlidersHorizontal, MapPin, Heart, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useProvinces } from '../hooks/useProvinces'
import ProvinceCard from '../components/province/ProvinceCard'
import { useAppStore } from '../store'

const REGIONS = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam']

export default function ExplorePage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [region, setRegion] = useState('Tất cả')
  const { favorites } = useAppStore()

  const { data: provinces = [], isLoading } = useProvinces(
    region !== 'Tất cả' ? region : null
  )

  const filtered = provinces.filter((p) =>
    query ? p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase()) : true
  )

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-px bg-jade-500" />
            <span className="text-jade-400 text-sm tracking-widest uppercase">Khám phá</span>
            <div className="w-8 h-px bg-jade-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
            63 Tỉnh thành <span className="gradient-text">Việt Nam</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Tìm kiếm và khám phá ẩm thực, địa điểm du lịch độc đáo của từng vùng miền
          </p>
        </motion.div>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Tìm kiếm tỉnh thành, ẩm thực..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-glass pl-11 pr-10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  region === r ? 'tab-active' : 'tab-inactive'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">
            {isLoading ? 'Đang tải...' : `${filtered.length} kết quả`}
            {query && <span className="text-jade-400"> cho "{query}"</span>}
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <MapPin size={12} />
            <span>Việt Nam</span>
          </div>
        </div>

        {/* Province grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton rounded-2xl h-72" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white/60 text-xl font-medium mb-2">Không tìm thấy kết quả</h3>
            <p className="text-white/30 text-sm">Thử tìm kiếm với từ khóa khác</p>
            <button onClick={() => { setQuery(''); setRegion('Tất cả') }} className="btn-secondary mt-6 text-sm">
              Xóa bộ lọc
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((province, i) => (
              <ProvinceCard key={province.id} province={province} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
