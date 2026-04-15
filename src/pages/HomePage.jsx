// src/pages/HomePage.jsx
import { useState, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Compass, Utensils, Camera, Star, MapPin } from 'lucide-react'
import ProvincePopup from '../components/province/ProvincePopup'
import VietnamMap2D from '../components/map/VietnamMap2D'

// Lazy-load 3D map
const VietnamMap3D = lazy(() => import('../3d/VietnamMap3D'))

const STATS = [
  { icon: MapPin, value: '63', label: 'Tỉnh thành' },
  { icon: Utensils, value: '500+', label: 'Món ẩm thực' },
  { icon: Camera, value: '1000+', label: 'Điểm tham quan' },
  { icon: Star, value: '4.9', label: 'Đánh giá TB' },
]

function LoadingMap() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="space-y-4 text-center">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-2 rounded-full border-jade-500/30 animate-ping" />
          <div className="absolute border-2 rounded-full inset-2 border-jade-400/50 animate-spin" />
          <div className="absolute rounded-full inset-4 bg-jade-500/30" />
        </div>
        <p className="text-sm text-white/40">Đang tải bản đồ 3D...</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [use3D, setUse3D] = useState(true)

  const handleProvinceSelect = (province) => {
    setSelectedProvince(province)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050a0f] via-[#080c14] to-[#060d1a]" />
        <div className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-jade-900/20 blur-3xl animate-pulse-slow" />
        <div className="absolute rounded-full bottom-1/3 right-1/4 w-80 h-80 bg-blue-900/15 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute w-64 h-64 rounded-full top-1/2 left-1/2 bg-gold-900/10 blur-3xl animate-float" />
      </div>

      {/* Hero section */}
      <section className="relative flex min-h-screen">
        {/* Left: text content */}
        <div className="relative z-10 flex flex-col justify-center w-full px-6 pt-24 pb-16 sm:px-12 lg:px-20 lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-jade-500" />
              <span className="text-sm font-medium tracking-widest uppercase text-jade-400">
                Khám phá Việt Nam
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl font-display">
              Hành trình{' '}
              <span className="italic gradient-text">ngàn năm</span>
              <br />
              văn hiến
            </h1>

            <p className="max-w-md mb-10 text-lg leading-relaxed text-white/60">
              Khám phá 63 tỉnh thành với ẩm thực đặc sắc, cảnh quan tuyệt vời và di sản văn hóa 
              phong phú qua bản đồ 3D tương tác.
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/explore')}
                className="flex items-center gap-2 btn-primary"
              >
                <Compass size={16} />
                Khám phá ngay
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 btn-secondary"
              >
                <MapPin size={16} />
                Xem bản đồ
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-14">
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-display font-bold text-white mb-0.5">{value}</div>
                  <div className="text-xs text-white/40">{label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: 3D map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="relative items-center justify-center flex-1 hidden pt-16 lg:flex"
        >
          {/* Map toggle */}
          <div className="absolute z-20 flex gap-2 top-24 right-6">
            <button
              onClick={() => setUse3D(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                use3D ? 'bg-jade-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              3D
            </button>
            <button
              onClick={() => setUse3D(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !use3D ? 'bg-jade-600 text-white' : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              2D
            </button>
          </div>

          {/* <div className="w-full h-[calc(100vh-4rem)] relative">
            {use3D ? (
              <Suspense fallback={<LoadingMap />}>
                <VietnamMap3D
                  onProvinceSelect={handleProvinceSelect}
                  selectedProvinceId={selectedProvince?.id}
                />
              </Suspense>
            ) : (
              <VietnamMap2D
                onProvinceSelect={handleProvinceSelect}
                selectedProvinceId={selectedProvince?.id}
              />
            )}

            {/* Province popup */}
            <AnimatePresence>
              {selectedProvince && (
                <ProvincePopup
                  province={selectedProvince}
                  onClose={() => setSelectedProvince(null)}
                />
              )}
            </AnimatePresence>
          </div> */}

          {/* Instruction hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute text-xs text-center -translate-x-1/2 bottom-8 left-1/2 text-white/30"
          >
            <MouseIcon className="w-4 h-4 mx-auto mb-1 animate-bounce" />
            Click vào điểm để xem thông tin
          </motion.div>
        </motion.div>
      </section>

      {/* Mobile map section */}
      <section id="map-section" className="px-4 py-12 lg:hidden">
        <h2 className="mb-6 text-2xl font-bold text-center text-white font-display">
          Bản đồ <span className="text-jade-400">Việt Nam</span>
        </h2>
        <div className="relative h-[500px] glass-card overflow-hidden">
          <Suspense fallback={<LoadingMap />}>
            {use3D ? (
              <VietnamMap3D
                onProvinceSelect={handleProvinceSelect}
                selectedProvinceId={selectedProvince?.id}
              />
            ) : (
              <VietnamMap2D
                onProvinceSelect={handleProvinceSelect}
                selectedProvinceId={selectedProvince?.id}
              />
            )}
          </Suspense>
          <AnimatePresence>
            {selectedProvince && (
              <ProvincePopup
                province={selectedProvince}
                onClose={() => setSelectedProvince(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features section */}
      <section className="px-6 py-20 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="mb-4 text-4xl font-bold text-white font-display">
              Tại sao chọn <span className="gradient-text">Vietnam Explorer</span>?
            </h2>
            <p className="max-w-2xl mx-auto text-white/50">
              Nền tảng du lịch Việt Nam toàn diện nhất với bản đồ 3D tương tác, dữ liệu phong phú và trải nghiệm người dùng tuyệt vời.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                emoji: '🗺️',
                title: 'Bản đồ 3D tương tác',
                desc: 'Khám phá Việt Nam qua bản đồ 3D sống động với hiệu ứng ánh sáng và animation đẹp mắt.',
              },
              {
                emoji: '🥘',
                title: 'Ẩm thực đặc sắc',
                desc: 'Hàng trăm món ăn đặc trưng của từng vùng miền được giới thiệu chi tiết với hình ảnh chất lượng cao.',
              },
              {
                emoji: '🏞️',
                title: 'Điểm du lịch nổi bật',
                desc: 'Danh sách đầy đủ các địa điểm tham quan, vui chơi giải trí tại mỗi tỉnh thành.',
              },
              {
                emoji: '💬',
                title: 'Cộng đồng du lịch',
                desc: 'Chia sẻ cảm nhận, bình luận và tương tác với cộng đồng người yêu du lịch Việt Nam.',
              },
              {
                emoji: '❤️',
                title: 'Lưu địa điểm yêu thích',
                desc: 'Tạo danh sách những nơi muốn đến và dễ dàng truy cập lại bất cứ lúc nào.',
              },
              {
                emoji: '📱',
                title: 'Tối ưu mọi thiết bị',
                desc: 'Trải nghiệm mượt mà trên cả điện thoại, máy tính bảng và máy tính để bàn.',
              },
            ].map(({ emoji, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 transition-all duration-300 glass-card hover:border-jade-500/30 group"
              >
                <div className="mb-4 text-3xl">{emoji}</div>
                <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-jade-300">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl p-12 mx-auto glass-card"
        >
          <div className="mb-4 text-5xl">🇻🇳</div>
          <h2 className="mb-4 text-3xl font-bold text-white font-display">
            Sẵn sàng khám phá?
          </h2>
          <p className="mb-8 text-white/50">
            Bắt đầu hành trình khám phá 63 tỉnh thành với ẩm thực, văn hóa và thiên nhiên đặc sắc.
          </p>
          <button onClick={() => navigate('/explore')} className="px-8 py-3 text-base btn-gold">
            Bắt đầu khám phá →
          </button>
        </motion.div>
      </section>
    </div>
  )
}

// Simple mouse icon
function MouseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="7" />
      <path d="M12 6v4" strokeLinecap="round" />
    </svg>
  )
}
