import { createPocketBaseApi } from './baseApi'
import type { Testimonial, CreateTestimonialData } from '../types'

export const testimonialsApi = createPocketBaseApi<Testimonial>('testimonials')