// src/services/supabase.js
// Supabase client configuration and API services

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ==================== PROVINCES ====================

export const provincesService = {
  // Get all provinces with optional region filter
  async getAll(region = null) {
    let query = supabase
      .from('provinces')
      .select('*')
      .order('name')

    if (region) {
      query = query.eq('region', region)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Get single province by slug
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('provinces')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  // Get province by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('provinces')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Increment visit count
  async incrementVisit(id) {
    const { error } = await supabase.rpc('increment_province_visits', { province_id: id })
    if (error) console.error('Visit increment error:', error)
  },

  // Create province (admin)
  async create(province) {
    const { data, error } = await supabase
      .from('provinces')
      .insert([province])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update province (admin)
  async update(id, updates) {
    const { data, error } = await supabase
      .from('provinces')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete province (admin)
  async delete(id) {
    const { error } = await supabase
      .from('provinces')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Search provinces
  async search(query) {
    const { data, error } = await supabase
      .from('provinces')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')

    if (error) throw error
    return data
  },
}

// ==================== FOODS ====================

export const foodsService = {
  async getByProvince(provinceId) {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('province_id', provinceId)
      .order('name')

    if (error) throw error
    return data
  },

  async create(food) {
    const { data, error } = await supabase
      .from('foods')
      .insert([food])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('foods')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('foods').delete().eq('id', id)
    if (error) throw error
  },
}

// ==================== ATTRACTIONS ====================

export const attractionsService = {
  async getByProvince(provinceId, type = null) {
    let query = supabase
      .from('attractions')
      .select('*')
      .eq('province_id', provinceId)
      .order('name')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async create(attraction) {
    const { data, error } = await supabase
      .from('attractions')
      .insert([attraction])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('attractions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('attractions').delete().eq('id', id)
    if (error) throw error
  },
}

// ==================== COMMENTS ====================

export const commentsService = {
  async getByProvince(provinceId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('province_id', provinceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async create(comment) {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (error) throw error
  },

  async getAll() {
    const { data, error } = await supabase
      .from('comments')
      .select('*, provinces(name)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    return data
  },
}

// ==================== REACTIONS ====================

export const reactionsService = {
  async getByProvince(provinceId) {
    const { data, error } = await supabase
      .from('reactions')
      .select('*')
      .eq('province_id', provinceId)

    if (error) throw error
    return data
  },

  async upsertReaction(provinceId, emoji) {
    // Check if reaction exists
    const { data: existing } = await supabase
      .from('reactions')
      .select('*')
      .eq('province_id', provinceId)
      .eq('emoji', emoji)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('reactions')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('reactions')
        .insert([{ province_id: provinceId, emoji, count: 1 }])
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  async getAllStats() {
    const { data, error } = await supabase
      .from('reactions')
      .select('province_id, emoji, count, provinces(name)')

    if (error) throw error
    return data
  },
}

// ==================== STORAGE ====================

export const storageService = {
  async uploadImage(bucket, file, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
    return urlData.publicUrl
  },

  getPublicUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },
}

// ==================== ANALYTICS ====================

export const analyticsService = {
  async getDashboardStats() {
    const [provinces, comments, reactions] = await Promise.all([
      supabase.from('provinces').select('id, name, visits_count, region'),
      supabase.from('comments').select('id', { count: 'exact' }),
      supabase.from('reactions').select('count'),
    ])

    const totalVisits = provinces.data?.reduce((sum, p) => sum + (p.visits_count || 0), 0) || 0
    const totalComments = comments.count || 0
    const totalReactions = reactions.data?.reduce((sum, r) => sum + (r.count || 0), 0) || 0

    return {
      totalProvinces: provinces.data?.length || 0,
      totalVisits,
      totalComments,
      totalReactions,
      topProvinces: [...(provinces.data || [])]
        .sort((a, b) => (b.visits_count || 0) - (a.visits_count || 0))
        .slice(0, 5),
    }
  },
}
