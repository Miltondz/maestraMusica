import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAppointments() {
    const appointments = useQuery(api.appointments.list);
    const createAppointment = useMutation(api.appointments.create);
    const updateStatus = useMutation(api.appointments.updateStatus);
    const deleteAppointment = useMutation(api.appointments.remove);

    return {
        appointments: appointments ?? [],
        loading: appointments === undefined,
        error: null,
        createAppointment,
        updateStatus,
        deleteAppointment
    };
}

export function useAvailableSlots(date: string) {
    // We can pass date to a query if we implemented it
    // For now, list all and filter, or use a specific query
    const slots = useQuery(api.appointments.getAvailableSlots, { date });
    return {
        slots: slots ?? [],
        loading: slots === undefined
    };
}
