import { pb } from '../services/pocketbase'
import { mapRecord } from './baseApi'
import type { Appointment, CreateAppointmentData } from '../types'

export const appointmentsApi = {
  // Get all appointments
  async getAll(): Promise<Appointment[]> {
    const records = await pb.collection('appointments').getFullList({
      sort: '+appointment_date',
    })
    return records.map(mapRecord<Appointment>)
  },

  // Get appointments by date range
  async getByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    const records = await pb.collection('appointments').getFullList({
      filter: `appointment_date >= "${startDate}" && appointment_date <= "${endDate}"`,
      sort: '+appointment_date',
    })
    return records.map(mapRecord<Appointment>)
  },

  // Get available time slots for a specific date
  async getAvailableSlots(date: string): Promise<string[]> {
    const records = await pb.collection('appointments').getFullList({
      filter: `appointment_date = "${date}" && status = "confirmed"`,
    })

    // Generate available slots (9 AM to 6 PM, hourly)
    const availableSlots: string[] = []
    const bookedTimes = new Set(records.map(apt => apt.appointment_time))

    for (let hour = 9; hour <= 18; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00:00`
      if (!bookedTimes.has(timeSlot)) {
        availableSlots.push(timeSlot)
      }
    }

    return availableSlots
  },

  // Create new appointment
  async create(appointmentData: CreateAppointmentData): Promise<Appointment> {
    const record = await pb.collection('appointments').create({
      ...appointmentData,
      status: 'pending'
    })
    return mapRecord<Appointment>(record)
  },

  // Update appointment status
  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<Appointment> {
    const record = await pb.collection('appointments').update(id, {
      status,
    })
    return mapRecord<Appointment>(record)
  },

  // Delete appointment
  async delete(id: string): Promise<void> {
    await pb.collection('appointments').delete(id)
  }
}