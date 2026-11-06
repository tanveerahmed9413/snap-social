import { useEffect } from "react";
import VideoVisibilityManager from "../managers/videoVisibilityManager";

const useVideoVisibility = (containerRef, playerRef) => {
  useEffect(() => {
    const container = containerRef.current;
    const player = playerRef.current;

    if (!container || !player) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.7) {
          VideoVisibilityManager.play(player);
        } else {
          VideoVisibilityManager.pause(player);
        }
      },
      {
        threshold: [0, 0.3, 0.5, 0.7, 1],
      },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      // Card unmount (refresh / navigation) ho to video band + manager se hata do
      VideoVisibilityManager.pause(player);
    };
  }, [containerRef, playerRef]);
};

export default useVideoVisibility;
