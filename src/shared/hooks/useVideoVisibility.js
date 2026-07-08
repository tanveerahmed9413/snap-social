import { useEffect } from "react";

const useVideoVisibility = (containerRef, playerRef) => {
  useEffect(() => {
    const element = containerRef.current;

    if (!element || !playerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(entry.isIntersecting);

        if (entry.isIntersecting) {
          playerRef.current.play();
        } else {
          playerRef.current.pause();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [containerRef, playerRef]);
};

export default useVideoVisibility;