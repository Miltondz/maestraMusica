import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("services").collect();
    },
});

export const get = query({
    args: { id: v.id("services") },
    handler: async (ctx, { id }) => {
        return await ctx.db.get(id);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        price: v.number(),
        duration_minutes: v.number(),
        image_url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        return await ctx.db.insert("services", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("services"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        duration_minutes: v.optional(v.number()),
        image_url: v.optional(v.string()),
    },
    handler: async (ctx, { id, ...args }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.patch(id, args);
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: { id: v.id("services") },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.delete(id);
    },
});
