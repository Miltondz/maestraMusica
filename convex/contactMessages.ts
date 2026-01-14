import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("contact_messages").order("desc").collect();
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        message: v.string(),
        phone: v.optional(v.string()),
        inquiry_type: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("contact_messages", {
            ...args,
            inquiry_type: args.inquiry_type ?? "General",
            is_read: false,
        });
    },
});

export const markAsRead = mutation({
    args: { id: v.id("contact_messages") },
    handler: async (ctx, { id }) => {
        await ctx.db.patch(id, { is_read: true });
    },
});

export const addResponse = mutation({
    args: { id: v.id("contact_messages"), response: v.string() },
    handler: async (ctx, { id, response }) => {
        await ctx.db.patch(id, { admin_response: response, is_read: true });
    },
});

export const remove = mutation({
    args: { id: v.id("contact_messages") },
    handler: async (ctx, { id }) => {
        await ctx.db.delete(id);
    },
});
