// src/components/shared/ItemCard.jsx
// Reusable card for food, attractions, entertainment

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MapPin, Info } from 'lucide-react'

const TYPE_BADGES = {
  food: { label: '🥘 Ẩm thực', class: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  tourism: { label: '🏞 Địa điểm', class: 'bg-jade-500/20 text-jade-300 border-jade-500/30' },
  entertainment: { label: '🎡 Vui chơi', class: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
}

export default function ItemCard({ item, type = 'food', index = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const badge = TYPE_BADGES[type] || TYPE_BADGES.food

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass-card overflow-hidden group hover:border-white/20 
                 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.image || `https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=70`}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=400&q=70'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm ${badge.class}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="text-white font-semibold text-base mb-2 font-display leading-snug">
          {item.name}
        </h4>

        {item.location && (
          <div className="flex items-center gap-1.5 text-white/40 text-xs mb-2">
            <MapPin size={11} />
            <span>{item.location}</span>
          </div>
        )}

        <p
          className={`text-white/60 text-sm leading-relaxed transition-all duration-300 
                      ${expanded ? '' : 'line-clamp-3'}`}
        >
          {item.description}
        </p>

        {item.description && item.description.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-jade-400 text-xs hover:text-jade-300 transition-colors flex items-center gap-1"
          >
            <Info size={11} />
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </div>
    </motion.div>
  )
}
