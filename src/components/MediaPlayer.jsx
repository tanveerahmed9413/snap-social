import React, { useRef, useState, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

const MediaPlayer = ({ 
  src, 
  fullWidth = false, 
  className = "", 
  alwaysShowControls = false  // new prop
}) => {
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(alwaysShowControls); // initial state based on prop

  // Play / Pause
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // Mute / Unmute
  const handleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  // Show controls and reset auto‑hide timer (only if not alwaysShowControls)
  const showPlayerControls = () => {
    if (alwaysShowControls) return; // never hide
    setShowControls(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Update showControls when alwaysShowControls changes (e.g., prop change)
  useEffect(() => {
    setShowControls(alwaysShowControls);
  }, [alwaysShowControls]);

  const containerClasses = `
    relative
    w-full
    ${fullWidth ? "max-w-none mx-0" : "max-w-[420px] mx-auto"}
    rounded-2xl
    overflow-hidden
    bg-black
    select-none
    ${className}
  `;

  return (
    <div
      className={containerClasses}
      onMouseEnter={() => !alwaysShowControls && setShowControls(true)}
      onMouseLeave={() => !alwaysShowControls && setShowControls(false)}
      onClick={showPlayerControls}
    >
      {/* Video element – use object-contain to preserve ratio */}
      <video
        ref={videoRef}
        src={src}
        onClick={handlePlayPause}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        preload="metadata"
        className="w-full h-full object-contain cursor-pointer" // changed from object-cover
      />

      {/* Controls overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Big Play button – visible only when paused */}
        {!playing && (
          <button
            onClick={handlePlayPause}
            className="h-16 w-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center pointer-events-auto transition-opacity duration-300"
          >
            <Play size={34} className="text-white" />
          </button>
        )}

        {/* Mute/Unmute button – always visible if alwaysShowControls */}
        <div
          className={`absolute bottom-4 right-4 transition-opacity duration-300 `}
        >
          <button
            onClick={handleMute}
            className="h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center pointer-events-auto text-white"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;