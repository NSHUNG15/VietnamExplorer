# 🇻🇳 Vietnam Explorer

> Nền tảng khám phá du lịch & ẩm thực Việt Nam với bản đồ 3D tương tác

![Vietnam Explorer](https://images.unsplash.com/photo-1555921015-5532091f6026?w=1200&q=80)

---

## ✨ Tính năng

- 🗺️ **Bản đồ 3D tương tác** — Three.js + React Three Fiber với animation sống động
- 🥘 **Ẩm thực** — Khám phá đặc sản từng vùng miền
- 🏞️ **Địa điểm du lịch** — Tham quan & vui chơi giải trí
- 💬 **Bình luận & phản ứng** — Không cần đăng nhập
- ❤️ **Lưu yêu thích** — Danh sách địa điểm muốn đến
- 🔍 **Tìm kiếm & lọc** — Theo tên, vùng miền
- 🛡️ **Admin panel** — Quản lý nội dung đầy đủ
- 📱 **Responsive** — Tối ưu mọi thiết bị

---

## 🚀 Cài đặt nhanh

```bash
# 1. Clone & install
git clone <repo-url>
cd vietnam-explorer
npm install

# 2. Cấu hình môi trường
cp .env.example .env
# Sửa .env với thông tin Supabase của bạn

# 3. Chạy development
npm run dev
```

---

## 🗄️ Cài đặt Supabase

1. Tạo project tại [supabase.com](https://supabase.com)
2. Vào **SQL Editor** → chạy file `supabase-schema.sql`
3. Lấy **Project URL** và **Anon Key** từ Settings → API
4. Điền vào file `.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_ADMIN_PASSWORD=your_password
```

> ⚡ **Không có Supabase?** App vẫn chạy với dữ liệu mẫu offline!

---

## 📁 Cấu trúc project

```
src/
├── 3d/                 # Three.js 3D map
│   └── VietnamMap3D.jsx
├── components/
│   ├── map/            # 2D SVG map fallback
│   ├── province/       # Province popup, cards, reactions, comments
│   └── shared/         # Navbar, ItemCard
├── data/
│   └── seedData.js     # Dữ liệu mẫu 10 tỉnh thành
├── hooks/
│   └── useProvinces.js # React Query hooks
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── HomePage.jsx        # 3D map + hero
│   ├── ExplorePage.jsx     # Grid danh sách tỉnh thành
│   ├── ProvinceDetailPage.jsx  # Chi tiết tỉnh (tabs)
│   ├── FavoritesPage.jsx   # Yêu thích
│   └── admin/
│       ├── AdminLogin.jsx
│       └── AdminDashboard.jsx
├── services/
│   └── supabase.js     # API layer
└── store/
    └── index.js        # Zustand state
```

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | React 18 + Vite |
| 3D | Three.js + React Three Fiber + Drei |
| Styling | TailwindCSS |
| Animation | Framer Motion |
| State | Zustand + React Query |
| Backend | Supabase (PostgreSQL + Storage + Auth) |
| Fonts | Playfair Display + DM Sans |

---

## 🔑 Admin Panel

- URL: `/admin`
- Mật khẩu mặc định: `vietnam2024`
- Đổi trong `.env`: `VITE_ADMIN_PASSWORD=your_password`

---

## 🏗️ Build cho production

```bash
npm run build
npm run preview
```

---

## 📝 License

MIT © Vietnam Explorer 2024
