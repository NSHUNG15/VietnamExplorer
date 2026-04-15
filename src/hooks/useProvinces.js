// src/hooks/useProvinces.js
// Custom React Query hooks for data fetching

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { provincesService, foodsService, attractionsService, commentsService, reactionsService } from '../services/supabase'
import { SEED_PROVINCES, SEED_FOODS, SEED_ATTRACTIONS } from '../data/seedData'
import { useDataStore } from '../store'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  return url && url !== 'https://demo.supabase.co' && !url.includes('demo')
}

// ============ PROVINCES ============

export function useProvinces(region = null) {
  const useLocalData = !isSupabaseConfigured()

  return useQuery({
    queryKey: ['provinces', region],
    queryFn: async () => {
      if (useLocalData) {
        // Use seed data as fallback
        return region
          ? SEED_PROVINCES.filter((p) => p.region === region)
          : SEED_PROVINCES
      }
      return provincesService.getAll(region)
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useProvince(slug) {
  const useLocalData = !isSupabaseConfigured()

  return useQuery({
    queryKey: ['province', slug],
    queryFn: async () => {
      if (useLocalData) {
        return SEED_PROVINCES.find((p) => p.slug === slug) || null
      }
      return provincesService.getBySlug(slug)
    },
    enabled: !!slug,
  })
}

export function useProvinceSearch(query) {
  const useLocalData = !isSupabaseConfigured()

  return useQuery({
    queryKey: ['provinces', 'search', query],
    queryFn: async () => {
      if (!query) return []
      if (useLocalData) {
        return SEED_PROVINCES.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      }
      return provincesService.search(query)
    },
    enabled: !!query,
    staleTime: 1000 * 30,
  })
}

// ============ FOODS ============

export function useFoods(provinceId, slug) {
  const useLocalData = !isSupabaseConfigured()

  return useQuery({
    queryKey: ['foods', provinceId || slug],
    queryFn: async () => {
      if (useLocalData) {
        return SEED_FOODS[slug] || []
      }
      return foodsService.getByProvince(provinceId)
    },
    enabled: !!(provinceId || slug),
  })
}

// ============ ATTRACTIONS ============

export function useAttractions(provinceId, slug, type = null) {
  const useLocalData = !isSupabaseConfigured()

  return useQuery({
    queryKey: ['attractions', provinceId || slug, type],
    queryFn: async () => {
      if (useLocalData) {
        const all = SEED_ATTRACTIONS[slug] || []
        return type ? all.filter((a) => a.type === type) : all
      }
      return attractionsService.getByProvince(provinceId, type)
    },
    enabled: !!(provinceId || slug),
  })
}

// ============ COMMENTS ============

export function useComments(provinceId) {
  const useLocalData = !isSupabaseConfigured()
  const localComments = useDataStore((s) => s.localComments)

  return useQuery({
    queryKey: ['comments', provinceId],
    queryFn: async () => {
      if (useLocalData) {
        return localComments[provinceId] || []
      }
      return commentsService.getByProvince(provinceId)
    },
    enabled: !!provinceId,
    staleTime: 1000 * 30,
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()
  const useLocalData = !isSupabaseConfigured()
  const addLocalComment = useDataStore((s) => s.addLocalComment)

  return useMutation({
    mutationFn: async (comment) => {
      if (useLocalData) {
        addLocalComment(comment.province_id, comment)
        return comment
      }
      return commentsService.create(comment)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.province_id] })
    },
  })
}

// ============ REACTIONS ============

export function useReactions(provinceId) {
  const useLocalData = !isSupabaseConfigured()
  const localReactions = useDataStore((s) => s.localReactions)

  return useQuery({
    queryKey: ['reactions', provinceId],
    queryFn: async () => {
      if (useLocalData) {
        // Convert local reactions to expected format
        const emojis = ['❤️', '😍', '👍', '🌟', '🎉']
        return emojis
          .map((emoji) => ({
            emoji,
            count: localReactions[`${provinceId}-${emoji}`] || 0,
            province_id: provinceId,
          }))
          .filter((r) => r.count > 0)
      }
      return reactionsService.getByProvince(provinceId)
    },
    enabled: !!provinceId,
  })
}

export function useAddReaction() {
  const queryClient = useQueryClient()
  const useLocalData = !isSupabaseConfigured()
  const addLocalReaction = useDataStore((s) => s.addLocalReaction)

  return useMutation({
    mutationFn: async ({ provinceId, emoji }) => {
      if (useLocalData) {
        addLocalReaction(provinceId, emoji)
        return { provinceId, emoji }
      }
      return reactionsService.upsertReaction(provinceId, emoji)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reactions', variables.provinceId] })
    },
  })
}

// ============ ADMIN MUTATIONS ============

export function useCreateProvince() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: provincesService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['provinces'] }),
  })
}

export function useUpdateProvince() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => provincesService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['provinces'] }),
  })
}

export function useDeleteProvince() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: provincesService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['provinces'] }),
  })
}
