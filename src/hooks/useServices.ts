import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Service } from '../types'

export function useServices() {
  const services = useQuery(api.services.list);
  const createService = useMutation(api.services.create);
  const updateService = useMutation(api.services.update);
  const deleteService = useMutation(api.services.remove);

  return {
    services: services ?? [],
    loading: services === undefined,
    error: null,
    createService,
    updateService,
    deleteService,
    refreshServices: () => { } // Convex is real-time, refresh not needed but kept for compatibility
  }
}