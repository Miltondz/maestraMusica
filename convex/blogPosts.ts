import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("blog_posts").order("desc").collect();
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        return await ctx.db
            .query("blog_posts")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        content: v.string(),
        author: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        published_date: v.optional(v.string()),
        image_url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const existing = await ctx.db
            .query("blog_posts")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
        if (existing) throw new Error(`Slug "${args.slug}" ya está en uso.`);

        return await ctx.db.insert("blog_posts", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("blog_posts"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.string()),
        author: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        published_date: v.optional(v.string()),
        image_url: v.optional(v.string()),
    },
    handler: async (ctx, { id, ...args }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        if (args.slug) {
            const existing = await ctx.db
                .query("blog_posts")
                .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
                .first();
            if (existing && existing._id !== id) {
                throw new Error(`Slug "${args.slug}" ya está en uso.`);
            }
        }

        await ctx.db.patch(id, args);
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: { id: v.id("blog_posts") },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.delete(id);
    },
});
