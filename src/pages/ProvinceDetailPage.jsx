// src/pages/ProvinceDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Eye, Heart, Utensils, Mountain, Gamepad2, MessageCircle } from 'lucide-react'
import { useProvince, useFoods, useAttractions } from '../hooks/useProvinces'
import { useAppStore } from '../store'
import { provincesService } from '../services/supabase'
import ItemCard from '../components/shared/ItemCard'
import ReactionBar from '../components/province/ReactionBar'
import CommentSection from '../components/province/CommentSection'

const TABS = [
  { id: 'food', label: 'Ẩm thực', icon: Utensils, emoji: '🥘' },
  { id: 'tourism', label: 'Địa điểm', icon: Mountain, emoji: '🏞' },
  { id: 'entertainment', label: 'Vui chơi', icon: Gamepad2, emoji: '🎡' },
  { id: 'comments', label: 'Bình luận', icon: MessageCircle, emoji: '💬' },
]

const REGION_STYLES = {
  'Miền Bắc': 'from-blue-900/40 via-cyan-900/20 to-transparent',
  'Miền Trung': 'from-purple-900/40 via-pink-900/20 to-transparent',
  'Miền Nam': 'from-amber-900/40 via-orange-900/20 to-transparent',
}

export default function ProvinceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('food')
  const { favorites, toggleFavorite } = useAppStore()

  const { data: province, isLoading: loadingProvince } = useProvince(slug)
  const { data: foods = [], isLoading: loadingFoods } = useFoods(province?.id, slug)
  const { data: tourismAttractions = [] } = useAttractions(province?.id, slug, 'tourism')
  const { data: entertainmentAttractions = [] } = useAttractions(province?.id, slug, 'entertainment')

  const isFav = favorites.includes(province?.id)

  // Increment visit count on mount
  useEffect(() => {
    if (province?.id) {
      provincesService.incrementVisit(province.id).catch(() => {})
    }
  }, [province?.id])

  const getTabContent = () => {
    switch (activeTab) {
      case 'food':
        return { items: foods, type: 'food', empty: '🍽️', emptyText: 'Chưa có thông tin ẩm thực' }
      case 'tourism':
        return { items: tourismAttractions, type: 'tourism', empty: '🏔️', emptyText: 'Chưa có địa điểm tham quan' }
      case 'entertainment':
        return { items: entertainmentAttractions, type: 'entertainment', empty: '🎪', emptyText: 'Chưa có địa điểm vui chơi' }
      default:
        return null
    }
  }

  const tabContent = getTabContent()
  const regionGrad = REGION_STYLES[province?.region] || REGION_STYLES['Miền Bắc']

  if (loadingProvince) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-jade-500/30 border-t-jade-500 animate-spin" />
          <p className="text-white/40">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!province) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-display text-white mb-2">Không tìm thấy tỉnh thành</h2>
          <p className="text-white/50 mb-6">Địa điểm bạn tìm kiếm không tồn tại</p>
          <button onClick={() => navigate('/explore')} className="btn-primary">
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <img
          src={province.image}
          alt={province.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${regionGrad}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/40 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-6 flex items-center gap-2 px-4 py-2 rounded-xl 
                     bg-black/40 backdrop-blur-sm border border-white/20 text-white/80 
                     hover:text-white hover:bg-black/60 transition-all text-sm"
        >
          <ArrowLeft size={15} />
          Quay lại
        </button>

        {/* Favorite */}
        <button
          onClick={() => toggleFavorite(province.id)}
          className="absolute top-20 right-6 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm 
                     border border-white/20 flex items-center justify-center transition-all hover:bg-black/60"
        >
          <Heart size={16} className={isFav ? 'text-red-400 fill-red-400' : 'text-white/70'} />
        </button>

        {/* Province info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70">
                {province.region}
              </span>
              <div className="flex items-center gap-1.5 text-white/40 text-sm">
                <Eye size={13} />
                <span>{province.visits_count?.toLocaleString()} lượt xem</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-2">
              {province.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 -mt-2">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <p className="text-white/70 leading-relaxed text-base">{province.description}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <MapPin size={14} className="text-jade-400" />
              <span>Việt Nam</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Eye size={14} className="text-jade-400" />
              <span>{province.visits_count?.toLocaleString()} lượt ghé thăm</span>
            </div>
          </div>
        </motion.div>

        {/* Reactions */}
        <div className="mb-6">
          <ReactionBar provinceId={province.id} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <span>{emoji}</span>
              {label}
              {id === 'food' && foods.length > 0 && (
                <span className="bg-white/20 text-white/80 text-xs px-1.5 py-0.5 rounded-full">
                  {foods.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'comments' ? (
            <motion.div
              key="comments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CommentSection provinceId={province.id} />
            </motion.div>
          ) : tabContent ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {tabContent.items.length === 0 ? (
                <div className="text-center py-16 glass-card">
                  <div className="text-5xl mb-3">{tabContent.empty}</div>
                  <p className="text-white/40">{tabContent.emptyText}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {tabContent.items.map((item, i) => (
                    <ItemCard key={item.id} item={item} type={tabContent.type} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
