import dataPosts from "@/data/events.json"; // Tu JSON inicial
import { Post } from "@/types/Post";
import { create } from "zustand";

interface PostsState {
  posts: Post[];
  // Acciones
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  addPost: (post: Post) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  // 1. Estado inicial (carga tu JSON aquí)
  posts: dataPosts as Post[],

  // 2. Acción para dar Like
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.userInteraction.isLiked;
          return {
            ...post,
            stats: {
              ...post.stats,
              likeCount: isLiked
                ? post.stats.likeCount + 1
                : post.stats.likeCount - 1,
            },
            userInteraction: { ...post.userInteraction, isLiked },
          };
        }
        return post;
      }),
    })),

  // 3. Acción para Guardar (Bookmark)
  toggleBookmark: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              userInteraction: {
                ...post.userInteraction,
                isBookmarked: !post.userInteraction.isBookmarked,
              },
            }
          : post
      ),
    })),

  // 4. Acción para crear post
  addPost: (newPost) =>
    set((state) => ({
      posts: [newPost, ...state.posts],
    })),
}));
