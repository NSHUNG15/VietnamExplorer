// src/components/province/ReactionBar.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReactions, useAddReaction } from '../../hooks/useProvinces'
import toast from 'react-hot-toast'

const EMOJIS = ['❤️', '😍', '👍', '🌟', '🎉']

export default function ReactionBar({ provinceId }) {
  const [clicked, setClicked] = useState(null)
  const { data: reactions = [] } = useReactions(provinceId)
  const { mutate: addReaction } = useAddReaction()

  const getCount = (emoji) => {
    const r = reactions.find((r) => r.emoji === emoji)
    return r?.count || 0
  }

  const totalReactions = reactions.reduce((s, r) => s + (r.count || 0), 0)

  const handleReact = (emoji) => {
    setClicked(emoji)
    addReaction({ provinceId, emoji })
    toast.success(`Bạn đã thả ${emoji}!`, { duration: 1500 })
    setTimeout(() => setClicked(null), 600)
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Cảm nhận của bạn</h3>
        {totalReactions > 0 && (
          <span className="text-white/40 text-xs">{totalReactions} lượt thả tim</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {EMOJIS.map((emoji) => {
          const count = getCount(emoji)
          return (
            <motion.button
              key={emoji}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleReact(emoji)}
              className={`emoji-btn relative ${clicked === emoji ? 'active' : ''}`}
            >
              <span className="text-base">{emoji}</span>
              {count > 0 && (
                <span className="text-white/70 text-xs font-medium">{count}</span>
              )}
              <AnimatePresence>
                {clicked === emoji && (
                  <motion.span
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -24, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg pointer-events-none"
                  >
                    {emoji}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
