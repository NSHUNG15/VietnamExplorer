// src/components/map/VietnamMap2D.jsx
// SVG-based interactive Vietnam map - used as fallback or mobile view

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SEED_PROVINCES } from '../../data/seedData'

export default function VietnamMap2D({ onProvinceSelect, selectedProvinceId }) {
  const [hoveredId, setHoveredId] = useState(null)
  const provinces = SEED_PROVINCES

  // Map container is 200x500 for Vietnam's shape ratio
  const MAP_W = 200
  const MAP_H = 500

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="w-full h-full max-w-[280px]"
        style={{ filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.3))' }}
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <ellipse cx="100" cy="250" rx="90" ry="240" fill="url(#mapGlow)" />

        {/* Vietnam simplified outline */}
        <path
          d={`
            M 84,4 L 100,0 L 116,6 L 130,12 L 140,20 L 146,28 L 152,36 L 156,44
            L 154,52 L 150,60 L 152,68 L 156,76 L 154,84 L 150,92 L 146,100
            L 144,108 L 148,116 L 154,124 L 152,132 L 148,140 L 144,148
            L 138,154 L 136,162 L 140,170 L 148,178 L 148,186 L 144,194
            L 136,202 L 130,210 L 124,218 L 116,226 L 106,232 L 96,236
            L 86,234 L 76,228 L 68,220 L 62,212 L 58,204 L 62,196
            L 66,188 L 64,180 L 60,172 L 58,164 L 60,156 L 62,148
            L 60,140 L 56,132 L 54,124 L 56,116 L 60,108 L 58,100
            L 54,92 L 52,84 L 56,76 L 60,68 L 58,60 L 54,52
            L 56,44 L 62,36 L 68,28 L 74,20 L 80,12 L 84,4 Z
          `}
          fill="#0f2d1a"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />

        {/* Animated highlight */}
        <path
          d={`
            M 84,4 L 100,0 L 116,6 L 130,12 L 140,20 L 146,28 L 152,36 L 156,44
            L 154,52 L 150,60 L 152,68 L 156,76 L 154,84 L 150,92 L 146,100
            L 144,108 L 148,116 L 154,124 L 152,132 L 148,140 L 144,148
            L 138,154 L 136,162 L 140,170 L 148,178 L 148,186 L 144,194
            L 136,202 L 130,210 L 124,218 L 116,226 L 106,232 L 96,236
            L 86,234 L 76,228 L 68,220 L 62,212 L 58,204 L 62,196
            L 66,188 L 64,180 L 60,172 L 58,164 L 60,156 L 62,148
            L 60,140 L 56,132 L 54,124 L 56,116 L 60,108 L 58,100
            L 54,92 L 52,84 L 56,76 L 60,68 L 58,60 L 54,52
            L 56,44 L 62,36 L 68,28 L 74,20 L 80,12 L 84,4 Z
          `}
          fill="none"
          stroke="#22c55e"
          strokeWidth="0.5"
          strokeOpacity="0.4"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-8"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>

        {/* Grid lines (latitude) */}
        {[50, 100, 150, 200, 250, 300, 350, 400, 450].map((y) => (
          <line
            key={y}
            x1="20"
            y1={y}
            x2="180"
            y2={y}
            stroke="rgba(34,197,94,0.08)"
            strokeWidth="0.5"
          />
        ))}

        {/* Province dots */}
        {provinces.map((province) => {
          const px = (province.map_x / 100) * MAP_W
          const py = (province.map_y / 100) * MAP_H
          const isSelected = selectedProvinceId === province.id
          const isHovered = hoveredId === province.id
          const active = isSelected || isHovered

          return (
            <g
              key={province.id}
              transform={`translate(${px}, ${py})`}
              style={{ cursor: 'pointer' }}
              onClick={() => onProvinceSelect(province)}
              onMouseEnter={() => setHoveredId(province.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Pulse ring */}
              {active && (
                <circle r="14" fill="none" stroke={province.highlight_color} strokeWidth="1" opacity="0.4">
                  <animate
                    attributeName="r"
                    values="8;18;8"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0;0.6"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Outer ring */}
              <circle
                r={active ? 7 : 5}
                fill="none"
                stroke={province.highlight_color}
                strokeWidth="1"
                opacity={active ? 0.8 : 0.4}
                style={{ transition: 'all 0.3s ease' }}
              />

              {/* Core dot */}
              <circle
                r={active ? 4 : 3}
                fill={province.highlight_color}
                opacity={active ? 1 : 0.7}
                filter="url(#glow)"
                style={{ transition: 'all 0.3s ease' }}
              />

              {/* Province name label */}
              {active && (
                <text
                  y={-12}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontFamily='"DM Sans", sans-serif'
                  fontWeight="600"
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))',
                  }}
                >
                  {province.name}
                </text>
              )}
            </g>
          )
        })}

        {/* Legend */}
        <g transform="translate(10, 470)">
          <circle cx="6" cy="6" r="4" fill="#22c55e" />
          <text x="14" y="10" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily='"DM Sans"'>
            Tỉnh/Thành phố
          </text>
        </g>
      </svg>

      {/* Region labels */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%] right-[5%] text-[10px] text-white/30 font-medium tracking-widest rotate-90">
          MIỀN BẮC
        </div>
        <div className="absolute top-[48%] right-[5%] text-[10px] text-white/30 font-medium tracking-widest rotate-90">
          MIỀN TRUNG
        </div>
        <div className="absolute top-[78%] right-[5%] text-[10px] text-white/30 font-medium tracking-widest rotate-90">
          MIỀN NAM
        </div>
      </div>
    </div>
  )
}
