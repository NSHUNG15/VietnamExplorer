// src/components/province/ProvincePopup.jsx
// Popup card when user clicks on a province dot on the map

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Heart, ArrowRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'

const REGION_COLORS = {
  'Miền Bắc': 'from-blue-600 to-cyan-600',
  'Miền Trung': 'from-purple-600 to-pink-600',
  'Miền Nam': 'from-amber-500 to-orange-600',
}

export default function ProvincePopup({ province, onClose }) {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useAppStore()
  const isFav = favorites.includes(province?.id)

  if (!province) return null

  const regionGradient = REGION_COLORS[province.region] || 'from-jade-600 to-teal-600'

  const handleViewDetails = () => {
    navigate(`/province/${province.slug}`)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[340px] max-w-[90vw]"
      >
        <div className="glass-card overflow-hidden shadow-2xl shadow-black/40">
          {/* Image header */}
          <div className="relative h-44 overflow-hidden">
            <img
              src={province.image}
              alt={province.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 
                         backdrop-blur-sm border border-white/20 flex items-center justify-center
                         text-white/80 hover:text-white hover:bg-black/70 transition-all"
            >
              <X size={14} />
            </button>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(province.id)}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 
                         backdrop-blur-sm border border-white/20 flex items-center justify-center
                         transition-all hover:bg-black/70"
            >
              <Heart
                size={14}
                className={isFav ? 'text-red-400 fill-red-400' : 'text-white/80'}
              />
            </button>

            {/* Province name overlay */}
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${regionGradient} 
                               text-white font-medium`}
                >
                  {province.region}
                </span>
              </div>
              <h3 className="text-white text-xl font-display font-bold leading-tight">
                {province.name}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Stats row */}
            <div className="flex items-center gap-4 mb-3 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-jade-400" />
                <span>{province.region}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={13} className="text-gold-400 fill-gold-400" />
                <span>{province.visits_count?.toLocaleString()} lượt xem</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed line-clamp-3 mb-4">
              {province.description}
            </p>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleViewDetails}
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
              >
                Xem Chi Tiết
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => toggleFavorite(province.id)}
                className={`px-3 py-2.5 rounded-xl border transition-all duration-200 
                           ${isFav
                  ? 'bg-red-500/20 border-red-400/50 text-red-400'
                  : 'bg-white/5 border-white/20 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Heart size={15} className={isFav ? 'fill-red-400' : ''} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
