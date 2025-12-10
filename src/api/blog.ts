import { createPocketBaseApi, mapRecord } from './baseApi'
import { pb } from '../services/pocketbase'
import type { BlogPost, CreateBlogPostData } from '../types'

const baseApi = createPocketBaseApi<BlogPost>('blog_posts')

export const blogApi = {
  ...baseApi,
  
  // Override getAll to sort by published_date
  async getAll(): Promise<BlogPost[]> {
    const records = await pb.collection('blog_posts').getFullList({
      sort: '-published_date',
    })
    return records.map(mapRecord<BlogPost>)
  },

  // Get blog post by slug
  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const record = await pb.collection('blog_posts').getFirstListItem(`slug="${slug}"`)
      return mapRecord<BlogPost>(record)
    } catch (error: any) {
      if (error.status === 404) return null
      throw error
    }
  }
}