import { useContext, useRef, useState } from "react";
import {
  createPost,
  deletePost,
  getAllPosts,
  getFeedPostIds,
  getNewPostsCount,
  getPostById,
  getPostsByIds,
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
import { shuffle } from "../../../utils/shuffle";

const PAGE_SIZE = 10;

const newestOf = (items) =>
  items.reduce(
    (max, item) => (!max || item.created_at > max ? item.created_at : max),
    null,
  );

export function usePost() {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const { user } = useAuth();

  // Like requests jo abhi in-flight hain (double click se bachne ke liye)
  const pendingLikes = useRef(new Set());

  const {
    posts,
    setPosts,

    loading,
    setLoading,

    refreshing,
    setRefreshing,

    error,
    setError,

    isMuted,
    setIsMuted,

    loadingMore,
    setLoadingMore,

    cursor,
    setCursor,

    hasMore,
    setHasMore,

    feedMode,
    setFeedMode,

    newPostsCount,
    setNewPostsCount,

    queueRef,
    requestIdRef,
    loadingMoreRef,
    newestAtRef,
    scrollTopRef,
    initializedRef,
  } = useContext(PostContext);

  // Random queue me se agle PAGE_SIZE posts nikalo
  const takeRandomPage = async () => {
    const ids = queueRef.current.splice(0, PAGE_SIZE);
    const pagePosts = await getPostsByIds(ids);
    return {
      posts: pagePosts,
      hasMore: queueRef.current.length > 0,
    };
  };

  /**
   * Feed load / refresh.
   * mode   : "random" (For You, har refresh pe naya shuffle) ya "latest"
   * silent : true => purane posts screen pe rehne do, bas refresh spinner dikhao
   */
  const loadFeed = async ({ mode = feedMode, silent = false } = {}) => {
    const requestId = ++requestIdRef.current;

    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      let result;

      if (mode === "random") {
        const index = await getFeedPostIds();

        queueRef.current = shuffle(index.map((item) => item.id));
        newestAtRef.current = newestOf(index);

        const page = await takeRandomPage();
        result = { posts: page.posts, nextCursor: null, hasMore: page.hasMore };
      } else {
        queueRef.current = [];
        result = await getAllPosts({ limit: PAGE_SIZE, cursor: null });
        newestAtRef.current = newestOf(result.posts);
      }

      // Naya request start ho chuka hai to ye purana response ignore karo
      if (requestId !== requestIdRef.current) return false;

      setPosts(result.posts);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
      setNewPostsCount(0);
      initializedRef.current = true;

      return true;
    } catch (err) {
      if (requestId !== requestIdRef.current) return false;

      console.error(err);
      setError(err?.message || "Feed load nahi ho paya");
      return false;
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Backward compatible naam (Feed pehle isse use karta tha)
  const handleGetPosts = (options) => loadFeed(options);

  // Refresh button / pull-to-refresh / new posts banner
  const handleRefreshFeed = (mode = feedMode) => {
    if (mode !== feedMode) setFeedMode(mode);
    return loadFeed({ mode, silent: posts.length > 0 });
  };

  const handleChangeMode = (mode) => {
    if (mode === feedMode) return;
    setFeedMode(mode);
    setPosts([]);
    return loadFeed({ mode, silent: false });
  };

  const handleLoadMorePosts = async () => {
    if (loadingMoreRef.current || loading || refreshing || !hasMore) {
      return;
    }

    if (feedMode === "latest" && !cursor) {
      return;
    }

    const requestId = requestIdRef.current;

    try {
      loadingMoreRef.current = true;
      setLoadingMore(true);

      let result;

      if (feedMode === "random") {
        const page = await takeRandomPage();
        result = { posts: page.posts, nextCursor: null, hasMore: page.hasMore };
      } else {
        result = await getAllPosts({ limit: PAGE_SIZE, cursor });
      }

      // Beech me refresh ho gaya to ye page ab relevant nahi
      if (requestId !== requestIdRef.current) return;

      setPosts((prev) => {
        const seen = new Set(prev.map((post) => post.id));
        return [...prev, ...result.posts.filter((post) => !seen.has(post.id))];
      });

      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error(err);
      showError("Aur posts load nahi hue, dobara try karo");
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  };

  // Kya koi naye posts aaye? (polling se call hota hai)
  const checkForNewPosts = async () => {
    try {
      const count = await getNewPostsCount({
        since: newestAtRef.current,
        excludeUserId: user?.id,
      });
      setNewPostsCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async ({ media, caption }) => {
    const id = showLoading("Post Creating...");

    try {
      await createPost({
        media,
        caption,
      });

      // Apni nayi post top pe dikhe isliye Latest feed pe switch
      setFeedMode("latest");
      await loadFeed({ mode: "latest", silent: false });

      showSuccess("Post Created");

      navigate("/app/home");

      return true;
    } catch (error) {
      showError(error?.message || "Something went wrong");
      return false;
    } finally {
      dismissToast(id);
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

      return true;
    } catch (error) {
      showError(error?.message || "Something went wrong");
      return false;
    } finally {
      dismissToast(id);
      setDeleting(false);
    }
  };

  // Optimistic like: UI turant update, error aaye to wapas rollback
  const handleToggleLike = async (postId) => {
    if (!user?.id) return;
    if (pendingLikes.current.has(postId)) return;

    const target = posts.find((post) => post.id === postId);
    if (!target) return;

    const wasLiked = (target.likes || []).some(
      (like) => like.user_id === user.id,
    );

    const apply = (shouldLike) =>
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) return post;

          const others = (post.likes || []).filter(
            (like) => like.user_id !== user.id,
          );

          return {
            ...post,
            likes: shouldLike ? [...others, { user_id: user.id }] : others,
          };
        }),
      );

    pendingLikes.current.add(postId);
    apply(!wasLiked);

    try {
      const liked = await toggleLike(postId);
      // Server ki final state UI se alag ho to sync kar do
      if (liked === wasLiked) apply(liked);
    } catch (error) {
      apply(wasLiked);
      showError(error?.message || "Something went wrong");
    } finally {
      pendingLikes.current.delete(postId);
    }
  };

  // Caller error handle karega (local loading state ke saath)
  const handleSinglePost = async (postId) => {
    return await getPostById(postId);
  };

  return {
    handleCreatePost,

    handleGetPosts,
    handleRefreshFeed,
    handleChangeMode,
    handleLoadMorePosts,
    checkForNewPosts,

    handleDeletePost,
    handleToggleLike,
    handleSinglePost,

    deleting,

    posts,
    setPosts,

    loading,
    refreshing,
    loadingMore,
    error,

    hasMore,

    feedMode,
    newPostsCount,

    scrollTopRef,
    initializedRef,

    isMuted,
    setIsMuted,
  };
}
