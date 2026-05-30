import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { ContactMessage } from '../types'

export const useContactMessages = () => {
  const { isAuthenticated } = useConvexAuth();
  const messages = useQuery(api.contactMessages.list, isAuthenticated ? {} : "skip");
  const markAsReadMutation = useMutation(api.contactMessages.markAsRead);
  const removeMessageMutation = useMutation(api.contactMessages.remove);
  const addResponseMutation = useMutation(api.contactMessages.addResponse);
  const createMessageMutation = useMutation(api.contactMessages.create);

  const fetchMessages = () => { }; // Not needed for real-time

  const markAsRead = async (id: any) => {
    await markAsReadMutation({ id });
  }

  const addResponse = async (id: any, response: string) => {
    await addResponseMutation({ id, response });
  }

  const removeMessage = async (id: any) => {
    await removeMessageMutation({ id });
  }

  const createMessage = async (messageData: any) => {
    return await createMessageMutation(messageData);
  }

  return {
    messages: messages ?? [],
    loading: messages === undefined,
    error: null,
    fetchMessages,
    markAsRead,
    addResponse,
    removeMessage,
    createMessage
  }
}

export const useUnreadMessages = () => {
  const { isAuthenticated } = useConvexAuth();
  const messages = useQuery(api.contactMessages.list, isAuthenticated ? {} : "skip");
  const unreadMessages = messages?.filter(m => !m.is_read) ?? [];

  return {
    unreadMessages,
    loading: messages === undefined,
    error: null,
    fetchUnreadMessages: () => { }
  }
}
