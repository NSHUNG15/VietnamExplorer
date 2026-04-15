// src/store/index.js
// Global state management with Zustand

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Main app store
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Selected province (for map interaction)
      selectedProvince: null,
      setSelectedProvince: (province) => set({ selectedProvince: province }),
      clearSelectedProvince: () => set({ selectedProvince: null }),

      // Region filter
      activeRegion: null,
      setActiveRegion: (region) => set({ activeRegion: region }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Favorites
      favorites: [],
      toggleFavorite: (provinceId) => {
        const { favorites } = get()
        const isFav = favorites.includes(provinceId)
        set({
          favorites: isFav
            ? favorites.filter((id) => id !== provinceId)
            : [...favorites, provinceId],
        })
      },
      isFavorite: (provinceId) => get().favorites.includes(provinceId),

      // Map state
      mapZoom: 1,
      setMapZoom: (zoom) => set({ mapZoom: zoom }),
      mapCenter: [0, 0, 0],
      setMapCenter: (center) => set({ mapCenter: center }),

      // UI state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'vietnam-explorer-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        favorites: state.favorites,
      }),
    }
  )
)

// Admin store
export const useAdminStore = create((set) => ({
  isAuthenticated: false,
  adminUser: null,

  login: (password) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'vietnam2024'
    if (password === adminPassword) {
      set({ isAuthenticated: true, adminUser: { role: 'admin', name: 'Admin' } })
      return true
    }
    return false
  },

  logout: () => set({ isAuthenticated: false, adminUser: null }),

  // Current editing item
  editingItem: null,
  setEditingItem: (item) => set({ editingItem: item }),

  // Current admin section
  activeSection: 'dashboard',
  setActiveSection: (section) => set({ activeSection: section }),
}))

// Data store (for fallback/offline mode)
export const useDataStore = create((set, get) => ({
  useLocalData: false,
  setUseLocalData: (val) => set({ useLocalData: val }),

  // Local reactions (stored in memory)
  localReactions: {},
  addLocalReaction: (provinceId, emoji) => {
    const { localReactions } = get()
    const key = `${provinceId}-${emoji}`
    set({
      localReactions: {
        ...localReactions,
        [key]: (localReactions[key] || 0) + 1,
      },
    })
  },

  // Local comments (stored in memory)
  localComments: {},
  addLocalComment: (provinceId, comment) => {
    const { localComments } = get()
    const existing = localComments[provinceId] || []
    set({
      localComments: {
        ...localComments,
        [provinceId]: [
          { ...comment, id: Date.now().toString(), created_at: new Date().toISOString() },
          ...existing,
        ],
      },
    })
  },
}))
