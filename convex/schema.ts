import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Servicios de música
  services: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    duration_minutes: v.number(),
    image_url: v.optional(v.string()),
  }),

  // Testimonios de clientes
  testimonials: defineTable({
    author_name: v.string(),
    content: v.string(),
    rating: v.optional(v.number()),
  }),

  // Artículos del blog
  blog_posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    author: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    published_date: v.optional(v.string()),
    image_url: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // Citas/Reservas
  appointments: defineTable({
    client_name: v.string(),
    client_email: v.string(),
    client_phone: v.optional(v.string()),
    service_id: v.id("services"),
    appointment_date: v.string(),
    appointment_time: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    notes: v.optional(v.string()),
  }).index("by_date", ["appointment_date"]),

  // Pagos
  payments: defineTable({
    appointment_id: v.optional(v.id("appointments")),
    amount: v.number(),
    payment_method: v.optional(v.string()),
    payment_date: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
  }).index("by_appointment", ["appointment_id"]),

  // Galería multimedia
  media_gallery: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    media_type: v.union(
      v.literal("photo"),
      v.literal("video"),
      v.literal("youtube"),
      v.literal("instagram")
    ),
    media_url: v.string(),
    thumbnail_url: v.optional(v.string()),
    category: v.string(),
    tags: v.optional(v.any()), // Can be array or string depending on processing
    is_featured: v.optional(v.boolean()),
  }).index("by_category", ["category"]),

  // Mensajes de contacto
  contact_messages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    inquiry_type: v.string(),
    is_read: v.optional(v.boolean()),
    admin_response: v.optional(v.string()),
  }),

  // Contenido del sitio (key-value)
  site_content: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),

  // Tabla para subidas de medios temporales o permanentes
  media_uploads: defineTable({
    storageId: v.id("_storage"),
  }),
});
