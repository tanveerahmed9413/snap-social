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
  const { posts, setPosts, loading, setLoading,isMuted,setIsMuted } = useContext(PostContext);

  const handleCreatePost = async ({ media, caption }) => {
    const id = showLoading("Post Creating...");
    try {
      setLoading(true);

      await createPost({
        media,
        caption,
      });

      const posts = await getAllPosts();

      setPosts(posts);

      showSuccess("Post Created");

      navigate("/app/home");
    } catch (error) {
      showError(error?.message || "Something went wrong");
    } finally {
      dismissToast(id);
      setLoading(false);
    }
  };

  const handleGetAllPost = async () => {
    try {
      setLoading(true);

      const posts = await getAllPosts();

      setPosts(posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

      const posts = await getAllPosts();

      setPosts(posts);
    } catch (error) {
      showError(error?.message || "Something went wrong");
    } finally {
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
    handleGetAllPost,
    handleDeletePost,
    handleToggleLike,
    handleSinglePost,
    deleting,
    posts,
    setPosts,
    loading,
    isMuted,
    setIsMuted
  };
}
