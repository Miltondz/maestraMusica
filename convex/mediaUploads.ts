import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveImage = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, { storageId }) => {
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
