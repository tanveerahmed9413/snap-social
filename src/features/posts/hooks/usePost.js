import { useContext, useState } from "react";
import { createPost, deletePost, getAllPosts } from "../services/post.api";
import { PostContext } from "../post.context";
import { useNavigate } from "react-router-dom";

export function usePost() {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const { posts, setPosts, loading, setLoading } = useContext(PostContext);

  const handleCreatePost = async ({ media, caption }) => {
    try {
      setLoading(true);

      await createPost({
        media,
        caption,
      });

      const posts = await getAllPosts();

      setPosts(posts);

      navigate("/app/home");
    } catch (error) {
      alert(error.message);
    } finally {
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
    try {
      setDeleting(true);
      await deletePost(postId);

      setPosts((prev) => {
        return prev.filter((post) => post.id != postId);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return {
    handleCreatePost,
    handleGetAllPost,
    handleDeletePost,
    deleting,
    posts,
    setPosts,
    loading,
  };
}
