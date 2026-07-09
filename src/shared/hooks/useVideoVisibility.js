import { useEffect } from "react";
import VideoVisibilityManager from "../managers/VideoVisibilityManager";

const useVideoVisibility = (containerRef, playerRef) => {
  useEffect(() => {
    if (!containerRef.current || !playerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.7) {
          VideoVisibilityManager.play(playerRef.current);
        } else {
          VideoVisibilityManager.pause(playerRef.current);
        }
      },
      {
        threshold: [0, 0.3, 0.5, 0.7, 1],
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);
};

export default useVideoVisibility;