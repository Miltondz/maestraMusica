import { pb } from '../services/pocketbase'
import { mapRecord } from './baseApi'
import type { Payment, CreatePaymentData } from '../types'

export const paymentsApi = {
  // Get all payments
  async getAll(): Promise<Payment[]> {
    const records = await pb.collection('payments').getFullList({
      sort: '-payment_date',
    })
    return records.map(mapRecord<Payment>)
  },

  // Get payment by ID
  async getById(id: string): Promise<Payment | null> {
    try {
      const record = await pb.collection('payments').getOne(id)
      return mapRecord<Payment>(record)
    } catch (error: any) {
      if (error.status === 404) return null
      throw error
    }
  },

  // Get payments by appointment ID
  async getByAppointmentId(appointmentId: string): Promise<Payment[]> {
    const records = await pb.collection('payments').getFullList({
      filter: `appointment_id = "${appointmentId}"`,
      sort: '-payment_date',
    })
    return records.map(mapRecord<Payment>)
  },

  // Get payments by status
  async getByStatus(status: 'completed' | 'pending' | 'cancelled' | 'failed'): Promise<Payment[]> {
    const records = await pb.collection('payments').getFullList({
      filter: `status = "${status}"`,
      sort: '-payment_date',
    })
    return records.map(mapRecord<Payment>)
  },

  // Create new payment
  async create(paymentData: CreatePaymentData): Promise<Payment> {
    const record = await pb.collection('payments').create(paymentData)
    return mapRecord<Payment>(record)
  },

  // Update payment
  async update(id: string, updates: Partial<CreatePaymentData>): Promise<Payment> {
    const record = await pb.collection('payments').update(id, updates)
    return mapRecord<Payment>(record)
  },

  // Update payment status
  async updateStatus(id: string, status: 'completed' | 'pending' | 'cancelled' | 'failed'): Promise<Payment> {
    const record = await pb.collection('payments').update(id, {
      status,
    })
    return mapRecord<Payment>(record)
  },

  // Delete payment
  async delete(id: string): Promise<void> {
    await pb.collection('payments').delete(id)
  },

  // Get payment statistics
  async getStats(): Promise<{
    totalRevenue: number
    pendingAmount: number
    paidCount: number
    pendingCount: number
  }> {
    const records = await pb.collection('payments').getFullList({
      fields: 'amount,status',
    })

    const payments = records
    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
    const paidCount = payments.filter(p => p.status === 'completed').length
    const pendingCount = payments.filter(p => p.status === 'pending').length

    return {
      totalRevenue,
      pendingAmount,
      paidCount,
      pendingCount
    }
  }
}
