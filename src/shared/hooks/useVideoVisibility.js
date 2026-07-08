import { useEffect, useRef } from "react";

const useVideoVisibility = (containerRef, playerRef) => {
  const wasVisible = useRef(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || !playerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible.current) {
          wasVisible.current = true;
          playerRef.current.play();
        }

        if (!entry.isIntersecting && wasVisible.current) {
          wasVisible.current = false;
          playerRef.current.pause();
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);
};

export default useVideoVisibility;