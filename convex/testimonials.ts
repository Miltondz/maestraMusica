import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("testimonials").collect();
    },
});

export const create = mutation({
    args: {
        author_name: v.string(),
        content: v.string(),
        rating: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        return await ctx.db.insert("testimonials", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("testimonials"),
        author_name: v.optional(v.string()),
        content: v.optional(v.string()),
        rating: v.optional(v.number()),
    },
    handler: async (ctx, { id, ...args }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.patch(id, args);
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: { id: v.id("testimonials") },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.delete(id);
    },
});
