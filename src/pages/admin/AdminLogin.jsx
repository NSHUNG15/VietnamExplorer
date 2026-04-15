// src/pages/admin/AdminLogin.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { useAdminStore } from '../../store'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const login = useAdminStore((s) => s.login)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const ok = login(password)
    if (!ok) {
      toast.error('Sai mật khẩu!')
    } else {
      toast.success('Đăng nhập thành công!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-jade-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-jade-500/30">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-white/40 text-sm">Vietnam Explorer Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Nhập mật khẩu admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Shield size={15} />
                Đăng nhập
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Mật khẩu mặc định: <span className="text-white/40 font-mono">vietnam2024</span>
        </p>
      </motion.div>
    </div>
  )
}
