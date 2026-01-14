import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function usePayments() {
    const payments = useQuery(api.payments.list);
    const stats = useQuery(api.payments.getStats);
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
