import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("appointments").order("asc").collect();
    },
});

export const getByDateRange = query({
    args: { startDate: v.string(), endDate: v.string() },
    handler: async (ctx, { startDate, endDate }) => {
        return await ctx.db
            .query("appointments")
            .filter((q) =>
                q.and(
                    q.gte(q.field("appointment_date"), startDate),
                    q.lte(q.field("appointment_date"), endDate)
                )
            )
            .collect();
    },
});

export const getAvailableSlots = query({
    args: { date: v.string() },
    handler: async (ctx, { date }) => {
        const booked = await ctx.db
            .query("appointments")
            .filter((q) =>
                q.and(
                    q.eq(q.field("appointment_date"), date),
                    q.eq(q.field("status"), "confirmed")
                )
            )
            .collect();

        const bookedTimes = new Set(booked.map((apt) => apt.appointment_time));
        const availableSlots: string[] = [];

        // Working hours 9:00 - 18:00
        for (let hour = 9; hour <= 18; hour++) {
            const timeSlot = `${hour.toString().padStart(2, "0")}:00:00`;
            if (!bookedTimes.has(timeSlot)) {
                availableSlots.push(timeSlot);
            }
        }

        return availableSlots;
    },
});

export const create = mutation({
    args: {
        client_name: v.string(),
        client_email: v.string(),
        client_phone: v.optional(v.string()),
        service_id: v.id("services"),
        appointment_date: v.string(),
        appointment_time: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("appointments", {
            ...args,
            status: "pending",
        });
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("appointments"),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("cancelled"),
            v.literal("completed")
        ),
    },
    handler: async (ctx, { id, status }) => {
        await ctx.db.patch(id, { status });
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: { id: v.id("appointments") },
    handler: async (ctx, { id }) => {
        await ctx.db.delete(id);
    },
});
