import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Testimonial } from '../types'

export function useTestimonials() {
  const testimonials = useQuery(api.testimonials.list);
  const createTestimonial = useMutation(api.testimonials.create);
  const updateTestimonial = useMutation(api.testimonials.update);
  const deleteTestimonial = useMutation(api.testimonials.remove);

  return {
    testimonials: testimonials ?? [],
    loading: testimonials === undefined,
    error: null,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refreshTestimonials: () => { } // Real-time
  }
}