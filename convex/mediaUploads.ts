import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    return await ctx.storage.generateUploadUrl();
});

export const saveImage = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, { storageId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.insert("media_uploads", { storageId });
        return await ctx.storage.getUrl(storageId);
    },
});

export const getImageUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, { storageId }) => {
        return await ctx.storage.getUrl(storageId);
    },
});
