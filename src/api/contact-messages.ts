import { createPocketBaseApi, mapRecord } from './baseApi'
import { pb } from '../services/pocketbase'
import type { ContactMessage, CreateContactMessageData } from '../types'

const baseApi = createPocketBaseApi<ContactMessage>('contact_messages')

export const contactMessagesApi = {
  ...baseApi,
  create: async (messageData: CreateContactMessageData): Promise<ContactMessage> => {
    const record = await pb.collection('contact_messages').create({
      ...messageData,
      is_read: messageData.is_read ?? false,
    })
    return mapRecord<ContactMessage>(record)
  },
  // Get unread contact messages
  async getUnread(): Promise<ContactMessage[]> {
    const records = await pb.collection('contact_messages').getFullList({
      filter: 'is_read = false',
      sort: '-created',
    })
    return records.map(mapRecord<ContactMessage>)
  },

  // Mark message as read
  async markAsRead(id: string): Promise<ContactMessage> {
    const record = await pb.collection('contact_messages').update(id, {
      is_read: true,
    })
    return mapRecord<ContactMessage>(record)
  },

  // Add admin response
  async addResponse(id: string, response: string): Promise<ContactMessage> {
    const record = await pb.collection('contact_messages').update(id, { 
      admin_response: response, 
      is_read: true,
    })
    return mapRecord<ContactMessage>(record)
  }
}