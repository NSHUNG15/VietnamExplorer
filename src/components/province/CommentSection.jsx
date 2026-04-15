// src/components/province/CommentSection.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, User, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useComments, useAddComment } from '../../hooks/useProvinces'
import toast from 'react-hot-toast'

export default function CommentSection({ provinceId }) {
  const [username, setUsername] = useState('')
  const [content, setContent] = useState('')
  const { data: comments = [], isLoading } = useComments(provinceId)
  const { mutate: addComment, isPending } = useAddComment()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !content.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }
    addComment(
      { province_id: provinceId, username: username.trim(), content: content.trim() },
      {
        onSuccess: () => {
          setContent('')
          toast.success('Bình luận đã được đăng!')
        },
      }
    )
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <MessageCircle size={16} className="text-jade-400" />
        <h3 className="text-white font-semibold">Bình luận ({comments.length})</h3>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Tên của bạn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-glass pl-9 text-sm"
            maxLength={50}
          />
        </div>
        <div className="relative">
          <textarea
            placeholder="Chia sẻ cảm nhận của bạn về điểm đến này..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="input-glass text-sm resize-none"
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-white/20 text-xs">{content.length}/500</div>
        </div>
        <button type="submit" disabled={isPending} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5">
          <Send size={14} />
          {isPending ? 'Đang đăng...' : 'Đăng bình luận'}
        </button>
      </form>

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-white/30">
          <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white/5 rounded-xl p-3 border border-white/5"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-jade-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                      {comment.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-white/90 text-sm font-medium">{comment.username}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/30 text-xs">
                    <Clock size={10} />
                    <span>
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed pl-9">{comment.content}</p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
