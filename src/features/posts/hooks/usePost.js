import { useContext, useState } from "react";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  toggleLike,
} from "../services/post.api";
import { PostContext } from "../post.context";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  dismissToast,
  showError,
  showLoading,
  showSuccess,
} from "../../../utils/toast";
import { AuthSessionMissingError } from "@supabase/supabase-js";

export function usePost() {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const {user } = useAuth()

  const {
    posts,
    setPosts,

    loading,
    setLoading,

    isMuted,
    setIsMuted,

    loadingMore,
    setLoadingMore,

    cursor,
    setCursor,

    hasMore,
    setHasMore,
    F,
  } = useContext(PostContext);

  const handleCreatePost = async ({ media, caption }) => {
    const id = showLoading("Post Creating...");

    try {
      await createPost({
        media,
        caption,
      });

      await handleGetPosts();

      showSuccess("Post Created");

      navigate("/app/home");
    } catch (error) {
      showError(error?.message || "Something went wrong");
    } finally {
      dismissToast(id);
    }
  };

  const handleGetPosts = async () => {
    try {
      setLoading(true);

      const result = await getAllPosts({
        limit: 10,
        cursor: null,
      });

      setPosts(result.posts);

      setCursor(result.nextCursor);

      setHasMore(result.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMorePosts = async () => {
    if (loadingMore || !hasMore || !cursor) {
      return;
    }

    try {
      setLoadingMore(true);

      const result = await getAllPosts({
        limit: 10,
        cursor,
      });

      setPosts((prev) => [...prev, ...result.posts]);

      setCursor(result.nextCursor);

      setHasMore(result.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const id = showLoading("Post Deleting...");
    try {
      setDeleting(true);
      await deletePost(postId);

      showSuccess("Post Deleted");

      setPosts((prev) => {
        return prev.filter((post) => post.id !== postId);
      });
    } catch (error) {
      showError(error?.message || "Something went wrong");
    } finally {
      dismissToast(id);
      setDeleting(false);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const liked = await toggleLike(postId);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          const currentLikes = post.likes || [];

          if (liked) {
            return {
              ...post,
              likes: [...currentLikes, { user_id: user.id }],
            };
          }

          return {
            ...post,
            likes: currentLikes.filter((like) => like.user_id !== user.id),
          };
        }),
      );
    } catch (error) {
      showError(error?.message || "Something went wrong");
    }
  };

  const handleSinglePost = async (postId) => {
    try {
      setLoading(true);
      return await getPostById(postId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreatePost,

    handleGetPosts,
    handleLoadMorePosts,

    handleDeletePost,
    handleToggleLike,
    handleSinglePost,

    deleting,

    posts,
    setPosts,

    loading,
    loadingMore,

    hasMore,

    isMuted,
    setIsMuted,
  };
}
