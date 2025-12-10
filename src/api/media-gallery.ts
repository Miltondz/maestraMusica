import { createPocketBaseApi, mapRecord } from './baseApi'
import { pb } from '../services/pocketbase'
import type { MediaGallery, CreateMediaGalleryData } from '../types'

const baseApi = createPocketBaseApi<MediaGallery>('media_gallery')

export const mediaGalleryApi = {
  ...baseApi,
  // Get featured media items
  async getFeatured(): Promise<MediaGallery[]> {
    const records = await pb.collection('media_gallery').getFullList({
      filter: 'is_featured = true',
      sort: '-created',
    })
    return records.map(mapRecord<MediaGallery>)
  },

  // Get media items by category
  async getByCategory(category: string): Promise<MediaGallery[]> {
    const records = await pb.collection('media_gallery').getFullList({
      filter: `category = "${category}"`,
      sort: '-created',
    })
    return records.map(mapRecord<MediaGallery>)
  },

  // Get media items by type
  async getByType(mediaType: 'photo' | 'video' | 'youtube' | 'instagram'): Promise<MediaGallery[]> {
    const records = await pb.collection('media_gallery').getFullList({
      filter: `media_type = "${mediaType}"`,
      sort: '-created',
    })
    return records.map(mapRecord<MediaGallery>)
  },

  // Toggle featured status
  async toggleFeatured(id: string, isFeatured: boolean): Promise<MediaGallery> {
    const record = await pb.collection('media_gallery').update(id, {
      is_featured: isFeatured,
    })
    return mapRecord<MediaGallery>(record)
  }
}