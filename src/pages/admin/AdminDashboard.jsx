// src/pages/admin/AdminDashboard.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Map, Utensils, Mountain, LogOut,
  TrendingUp, MessageCircle, Heart, Eye, Plus, Pencil, Trash2, X
} from 'lucide-react'
import { useAdminStore } from '../../store'
import { useProvinces } from '../../hooks/useProvinces'
import { analyticsService } from '../../services/supabase'
import { useQuery } from '@tanstack/react-query'
import { SEED_PROVINCES } from '../../data/seedData'
import toast from 'react-hot-toast'

const NAV = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'provinces', label: 'Tỉnh thành', icon: Map },
  { id: 'foods', label: 'Ẩm thực', icon: Utensils },
  { id: 'attractions', label: 'Địa điểm', icon: Mountain },
  { id: 'comments', label: 'Bình luận', icon: MessageCircle },
]

function StatCard({ icon: Icon, label, value, color = 'jade' }) {
  const colors = {
    jade: 'from-jade-600 to-teal-600',
    gold: 'from-gold-500 to-amber-600',
    blue: 'from-blue-600 to-cyan-600',
    purple: 'from-purple-600 to-pink-600',
  }
  return (
    <div className="glass-card p-5">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-2xl font-display font-bold text-white mb-0.5">{value}</div>
      <div className="text-white/50 text-xs">{label}</div>
    </div>
  )
}

function DashboardView() {
  const provinces = SEED_PROVINCES
  const totalVisits = provinces.reduce((s, p) => s + (p.visits_count || 0), 0)
  const topProvinces = [...provinces].sort((a, b) => b.visits_count - a.visits_count).slice(0, 5)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-bold text-white">Tổng quan</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Map} label="Tỉnh thành" value={provinces.length} color="jade" />
        <StatCard icon={Eye} label="Tổng lượt xem" value={totalVisits.toLocaleString()} color="blue" />
        <StatCard icon={MessageCircle} label="Bình luận" value="--" color="purple" />
        <StatCard icon={Heart} label="Lượt thả tim" value="--" color="gold" />
      </div>

      {/* Top provinces */}
      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-jade-400" />
          Top tỉnh thành được xem nhiều nhất
        </h3>
        <div className="space-y-3">
          {topProvinces.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-white/30 text-sm w-5">{i + 1}</span>
              <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="text-white/90 text-sm font-medium">{p.name}</div>
                <div className="h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-jade-500 to-teal-500 rounded-full"
                    style={{ width: `${(p.visits_count / topProvinces[0].visits_count) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-white/40 text-xs">{p.visits_count?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProvincesView() {
  const { data: provinces = [] } = useProvinces()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-white">Quản lý tỉnh thành</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 text-sm py-2"
        >
          <Plus size={14} /> Thêm mới
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Tên</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Vùng</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Lượt xem</th>
                <th className="text-right px-4 py-3 text-white/40 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {provinces.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-white/80">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/50">{p.region}</td>
                  <td className="px-4 py-3 text-white/50">{p.visits_count?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => toast('Chức năng này cần Supabase thật', { icon: 'ℹ️' })}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/50 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Thêm tỉnh thành</h3>
              <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input placeholder="Tên tỉnh thành" className="input-glass text-sm" />
              <input placeholder="Slug (vd: ha-noi)" className="input-glass text-sm" />
              <select className="input-glass text-sm">
                <option>Miền Bắc</option>
                <option>Miền Trung</option>
                <option>Miền Nam</option>
              </select>
              <textarea placeholder="Mô tả" rows={3} className="input-glass text-sm resize-none" />
              <input placeholder="URL ảnh đại diện" className="input-glass text-sm" />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { toast('Cần kết nối Supabase!', { icon: 'ℹ️' }); setShowForm(false) }}
                className="btn-primary flex-1 text-sm py-2.5"
              >
                Lưu
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm py-2.5">
                Hủy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { activeSection, setActiveSection, logout } = useAdminStore()

  const sections = { dashboard: DashboardView, provinces: ProvincesView }
  const ActiveView = sections[activeSection] || DashboardView

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/10 p-4 hidden md:block">
        <div className="mb-6 px-2 pt-2">
          <p className="text-white/30 text-xs uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`admin-sidebar-item w-full ${activeSection === id ? 'active' : ''}`}
            >
              <Icon size={15} />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <button
            onClick={logout}
            className="admin-sidebar-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={15} />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveView />
        </motion.div>
      </main>
    </div>
  )
}
