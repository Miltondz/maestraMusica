import { Id } from "../../convex/_generated/dataModel";

export interface Service {
  _id: Id<"services">
  _creationTime: number
  name: string
  description?: string
  price: number
  duration_minutes: number
  image_url?: string
}

export interface Testimonial {
  _id: Id<"testimonials">
  _creationTime: number
  author_name: string
  content: string
  rating?: number
}

export interface BlogPost {
  _id: Id<"blog_posts">
  _creationTime: number
  title: string
  slug: string
  content: string
  excerpt?: string
  published_date?: string
  image_url?: string
}

export interface Appointment {
  _id: Id<"appointments">
  _creationTime: number
  client_name: string
  client_email: string
  client_phone?: string
  service_id: Id<"services">
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
}

export interface Payment {
  _id: Id<"payments">
  _creationTime: number
  appointment_id?: Id<"appointments">
  amount: number
  payment_method?: string
  payment_date?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
}

export interface MediaGallery {
  _id: Id<"media_gallery">
  _creationTime: number
  title: string
  description?: string
  media_type: 'photo' | 'video' | 'youtube' | 'instagram'
  media_url: string
  thumbnail_url?: string
  category: string
  tags?: string[] | string
  is_featured?: boolean
}

export interface ContactMessage {
  _id: Id<"contact_messages">
  _creationTime: number
  name: string
  email: string
  phone?: string
  message: string
  inquiry_type: string
  is_read?: boolean
  admin_response?: string
}

export interface CreateAppointmentData {
  client_name: string
  client_email: string
  client_phone?: string
  service_id: string
  appointment_date: string
  appointment_time: string
  notes?: string
}

export interface CreateServiceData {
  name: string
  description?: string
  price: number
  duration_minutes: number
  image_url?: string
}

export interface CreateTestimonialData {
  author_name: string
  content: string
  rating?: number
}

export interface CreateBlogPostData {
  title: string
  slug?: string
  content: string
  excerpt?: string
  image_url?: string
  published_date?: string
  author?: string
}

export interface CreatePaymentData {
  appointment_id: string
  amount: number
  payment_method?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
}

export interface CreateMediaGalleryData {
  title: string
  media_type: 'photo' | 'video' | 'youtube' | 'instagram'
  media_url: string
  thumbnail_url?: string
  category: string
  tags?: string[] | string
  is_featured?: boolean
}

export interface CreateContactMessageData {
  name: string
  email: string
  message: string
  inquiry_type?: string
  is_read?: boolean
}

export type MediaItem = MediaGallery

export interface SiteContent {
  _id: Id<"site_content">
  _creationTime: number
  key: string;
  value: any;
}