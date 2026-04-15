// src/components/province/ProvinceCard.jsx
// Grid card for province listing

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Heart, Eye, ArrowRight } from 'lucide-react'
import { useAppStore } from '../../store'

const REGION_BADGES = {
  'Miền Bắc': { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
  'Miền Trung': { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', dot: 'bg-purple-400' },
  'Miền Nam': { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
}

export default function ProvinceCard({ province, index = 0 }) {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useAppStore()
  const isFav = favorites.includes(province.id)

  const badge = REGION_BADGES[province.region] || REGION_BADGES['Miền Bắc']

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      className="province-card group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={province.image}
          alt={province.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(province.id)
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm
                     border border-white/20 flex items-center justify-center opacity-0 
                     group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Heart
            size={13}
            className={isFav ? 'text-red-400 fill-red-400' : 'text-white'}
          />
        </button>

        {/* Region badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm 
                        font-medium ${badge.color}`}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${badge.dot} mr-1.5`} />
            {province.region}
          </span>
        </div>

        {/* Visit count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/60 text-xs">
          <Eye size={11} />
          <span>{province.visits_count?.toLocaleString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-display text-lg font-semibold leading-tight">
            {province.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-white/40 text-xs mb-3">
          <MapPin size={11} />
          <span>Việt Nam</span>
        </div>

        <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">
          {province.description}
        </p>

        {/* Action */}
        <button
          onClick={() => navigate(`/province/${province.slug}`)}
          className="w-full flex items-center justify-between px-4 py-2.5 
                     bg-white/5 hover:bg-jade-600/20 border border-white/10 
                     hover:border-jade-500/40 rounded-xl transition-all duration-300
                     text-white/70 hover:text-white text-sm font-medium group/btn"
        >
          <span>Khám phá ngay</span>
          <ArrowRight
            size={14}
            className="transform group-hover/btn:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  )
}
