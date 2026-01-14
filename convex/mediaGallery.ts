import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("media_gallery").collect();
    },
});

export const getByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, { category }) => {
        return await ctx.db
            .query("media_gallery")
            .withIndex("by_category", (q) => q.eq("category", category))
            .collect();
    },
});

export const create = mutation({
    args: {
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
        tags: v.optional(v.array(v.string())),
        is_featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("media_gallery", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("media_gallery"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        media_type: v.optional(v.union(
            v.literal("photo"),
            v.literal("video"),
            v.literal("youtube"),
            v.literal("instagram")
        )),
        media_url: v.optional(v.string()),
        thumbnail_url: v.optional(v.string()),
        category: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        is_featured: v.optional(v.boolean()),
    },
    handler: async (ctx, { id, ...args }) => {
        await ctx.db.patch(id, args);
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: { id: v.id("media_gallery") },
    handler: async (ctx, { id }) => {
        await ctx.db.delete(id);
    },
});
