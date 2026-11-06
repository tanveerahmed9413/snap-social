import { showError, showSuccess } from "./toast";

// Post / reel ka link share karta hai.
// Phone pe native share sheet khulti hai, desktop pe link copy ho jata hai.
export const sharePost = async (post) => {
  const url = `${window.location.origin}/post/${post.id}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: `${post.profiles?.username || "Lumina"}'s post`,
        text: post.caption || "",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      showSuccess("Link copied!");
    }
  } catch (error) {
    // User ne share sheet band kar di, ye error nahi hai
    if (error?.name === "AbortError") return;

    console.error("Share error:", error);
    showError("Share nahi ho paya");
  }
};
