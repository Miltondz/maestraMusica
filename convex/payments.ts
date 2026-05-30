import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        return await ctx.db.query("payments").order("desc").collect();
    },
});

export const getByAppointmentId = query({
    args: { appointmentId: v.id("appointments") },
    handler: async (ctx, { appointmentId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        return await ctx.db
            .query("payments")
            .withIndex("by_appointment", (q) => q.eq("appointment_id", appointmentId))
            .collect();
    },
});

export const create = mutation({
    args: {
        appointment_id: v.optional(v.id("appointments")),
        amount: v.number(),
        payment_date: v.optional(v.string()),
        payment_method: v.optional(v.string()),
        status: v.union(
            v.literal("pending"),
            v.literal("completed"),
            v.literal("failed"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        return await ctx.db.insert("payments", args);
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("payments"),
        status: v.union(
            v.literal("pending"),
            v.literal("completed"),
            v.literal("failed"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, { id, status }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.patch(id, { status });
        return await ctx.db.get(id);
    },
});

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        const payments = await ctx.db.query("payments").collect();

        const totalRevenue = payments
            .filter((p) => p.status === "completed")
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingAmount = payments
            .filter((p) => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0);

        const paidCount = payments.filter((p) => p.status === "completed").length;
        const pendingCount = payments.filter((p) => p.status === "pending").length;

        return { totalRevenue, pendingAmount, paidCount, pendingCount };
    },
});

export const remove = mutation({
    args: { id: v.id("payments") },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.delete(id);
    },
});
