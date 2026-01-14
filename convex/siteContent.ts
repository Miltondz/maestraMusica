import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("site_content").collect();
    },
});

export const getByKey = query({
    args: { key: v.string() },
    handler: async (ctx, { key }) => {
        return await ctx.db
            .query("site_content")
            .withIndex("by_key", (q) => q.eq("key", key))
            .unique();
    },
});

export const updateBulk = mutation({
    args: {
        updates: v.array(v.object({
            key: v.string(),
            value: v.any(),
        })),
    },
    handler: async (ctx, { updates }) => {
        for (const update of updates) {
            const existing = await ctx.db
                .query("site_content")
                .withIndex("by_key", (q) => q.eq("key", update.key))
                .unique();

            if (existing) {
                await ctx.db.patch(existing._id, { value: update.value });
            } else {
                await ctx.db.insert("site_content", {
                    key: update.key,
                    value: update.value,
                });
            }
        }
    },
});
