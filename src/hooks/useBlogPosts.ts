import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { BlogPost } from '../types'

export function useBlogPosts() {
  const blogPosts = useQuery(api.blogPosts.list);
  const createBlogPost = useMutation(api.blogPosts.create);
  const updateBlogPost = useMutation(api.blogPosts.update);
  const deleteBlogPost = useMutation(api.blogPosts.remove);

  return {
    blogPosts: blogPosts ?? [],
    loading: blogPosts === undefined,
    error: null,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    refreshBlogPosts: () => { } // Real-time
  }
}