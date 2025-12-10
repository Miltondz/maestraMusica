import { pb } from '../services/pocketbase'
import type { RecordModel } from 'pocketbase'

// Helper to map PocketBase record to App types
export function mapRecord<T>(record: RecordModel): T {
  return {
    ...record,
    id: record.id,
    created_at: record.created,
    updated_at: record.updated,
  } as unknown as T
}

export function createPocketBaseApi<T>(collectionName: string) {
  return {
    async getAll(): Promise<T[]> {
      const records = await pb.collection(collectionName).getFullList({
        sort: '-created',
      })
      return records.map(mapRecord<T>)
    },

    async getById(id: string): Promise<T | null> {
      try {
        const record = await pb.collection(collectionName).getOne(id)
        return mapRecord<T>(record)
      } catch (error: any) {
        if (error.status === 404) return null
        throw error
      }
    },

    async create(itemData: any): Promise<T> {
      const record = await pb.collection(collectionName).create(itemData)
      return mapRecord<T>(record)
    },

    async update(id: string, updates: any): Promise<T> {
      const record = await pb.collection(collectionName).update(id, updates)
      return mapRecord<T>(record)
    },

    async delete(id: string): Promise<void> {
      await pb.collection(collectionName).delete(id)
    }
  }
}