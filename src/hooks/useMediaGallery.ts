import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { MediaGallery as MediaItem } from '../types';

export const useMediaGallery = () => {
  const mediaItems = useQuery(api.mediaGallery.list);
  const addMutation = useMutation(api.mediaGallery.create);
  const editMutation = useMutation(api.mediaGallery.update);
  const removeMutation = useMutation(api.mediaGallery.remove);

  return {
    mediaItems: mediaItems ?? [],
    loading: mediaItems === undefined,
    error: null,
    fetchMediaItems: () => { },
    fetchMediaByCategory: () => { }, // Handled by standard list or we could filter
    addMediaItem: async (args: any) => await addMutation(args),
    editMediaItem: async (id: any, updates: any) => await editMutation({ id, ...updates }),
    removeMediaItem: async (id: any) => await removeMutation({ id })
  };
};

export const useFeaturedMedia = () => {
  const mediaItems = useQuery(api.mediaGallery.list);
  const featuredItems = mediaItems?.filter(item => item.is_featured) ?? [];

  return {
    featuredItems,
    loading: mediaItems === undefined,
    error: null,
    fetchFeaturedItems: () => { }
  };
};
