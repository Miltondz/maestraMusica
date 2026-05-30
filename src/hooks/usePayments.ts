import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";

export function usePayments() {
    const { isAuthenticated } = useConvexAuth();
    const payments = useQuery(api.payments.list, isAuthenticated ? {} : "skip");
    const stats = useQuery(api.payments.getStats, isAuthenticated ? {} : "skip");
    const createPayment = useMutation(api.payments.create);
    const updateStatus = useMutation(api.payments.updateStatus);
    const deletePayment = useMutation(api.payments.remove);

    return {
        payments: payments ?? [],
        stats,
        loading: payments === undefined,
        error: null, // You could add error handling if desired
        createPayment,
        updateStatus,
        deletePayment
    };
}
