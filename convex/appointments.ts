import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        return await ctx.db.query("appointments").order("asc").collect();
    },
});

export const getByDateRange = query({
    args: { startDate: v.string(), endDate: v.string() },
    handler: async (ctx, { startDate, endDate }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
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
            .withIndex("by_date", (q) => q.eq("appointment_date", date))
            .filter((q) =>
                q.or(
                    q.eq(q.field("status"), "confirmed"),
                    q.eq(q.field("status"), "pending")
                )
            )
            .collect();

        const bookedTimes = new Set(booked.map((apt) => apt.appointment_time));
        const availableSlots: string[] = [];

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
        const existing = await ctx.db
            .query("appointments")
            .withIndex("by_date", (q) => q.eq("appointment_date", args.appointment_date))
            .filter((q) =>
                q.and(
                    q.eq(q.field("appointment_time"), args.appointment_time),
                    q.or(
                        q.eq(q.field("status"), "pending"),
                        q.eq(q.field("status"), "confirmed")
                    )
                )
            )
            .first();

        if (existing) {
            throw new Error("Este horario ya no está disponible. Por favor elige otro.");
        }

        const id = await ctx.db.insert("appointments", { ...args, status: "pending" });

        const service = await ctx.db.get(args.service_id);
        await ctx.scheduler.runAfter(0, internal.resend.sendBookingConfirmation, {
            clientEmail: args.client_email,
            clientName: args.client_name,
            serviceName: service?.name ?? "Clase de Música",
            appointmentDate: args.appointment_date,
            appointmentTime: args.appointment_time,
        });

        return id;
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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.patch(id, { status });
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: { id: v.id("appointments") },
    handler: async (ctx, { id }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");
        await ctx.db.delete(id);
    },
});
