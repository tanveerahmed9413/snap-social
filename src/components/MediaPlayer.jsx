import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

const MediaPlayer = forwardRef(
  (
    {
      src,
      fullWidth = false,
      className = "",
      autoPlay = false,
      loop = false,
      defaultMuted = false,
      showPlayBtn = true,
      showMuteBtn = true,
      showProgress = false, // neeche patli progress bar (reels ke liye)
      rounded = true,
      preload = "metadata", // reels me "auto" (jaldi chalne ke liye)
      muted, // controlled (optional)
      onMuteToggle,
    },
    ref,
  ) => {
    const videoRef = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [failed, setFailed] = useState(false);
    const [buffering, setBuffering] = useState(false);
    const progressRef = useRef(null);

    // Agar parent ne `muted` nahi diya to player khud mute state manage karega
    // (pehle is case me mute button kuch karta hi nahi tha)
    const [internalMuted, setInternalMuted] = useState(defaultMuted);
    const isMuted = muted ?? internalMuted;

    const setMuted = (value) => {
      if (onMuteToggle) {
        onMuteToggle(value);
      } else {
        setInternalMuted(value);
      }
    };

    useImperativeHandle(ref, () => ({
      play() {
        videoRef.current?.play().catch(() => {});
      },

      pause() {
        videoRef.current?.pause();
      },

      mute() {
        setMuted(true);
      },

      unMute() {
        setMuted(false);
      },

      getVideo() {
        return videoRef.current;
      },
    }));

    const handlePlayPause = (e) => {
      e.stopPropagation();

      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const handleMute = (e) => {
      e.stopPropagation();
      setMuted(!isMuted);
    };

    // Progress bar ko state ke bajaye seedhe DOM me update karte hain,
    // warna video chalte waqt component har second kai baar re-render hota
    const handleTimeUpdate = () => {
      const video = videoRef.current;
      if (!showProgress || !video?.duration || !progressRef.current) return;

      progressRef.current.style.width = `${(video.currentTime / video.duration) * 100}%`;
    };

    const containerClasses = `relative w-full
    ${fullWidth ? "max-w-none mx-0" : "max-w-[420px] mx-auto"}
    ${rounded ? "rounded-2xl" : ""} overflow-hidden bg-black select-none ${className}`;

    if (failed) {
      return (
        <div
          className={`${containerClasses} flex items-center justify-center min-h-[200px] text-sm text-gray-400`}
        >
          Video load nahi hua
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <video
          ref={videoRef}
          // #t=0.1 se browser first frame dikha deta hai, load hone tak black screen nahi
          src={src ? `${src}#t=0.1` : src}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          playsInline
          onClick={handlePlayPause}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          onCanPlay={() => setBuffering(false)}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setFailed(true)}
          preload={preload}
          className="w-full h-full object-contain cursor-pointer"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {buffering && (
            <div className="absolute h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          )}

          {showPlayBtn && !playing && !buffering && (
            <button
              onClick={handlePlayPause}
              aria-label="Play"
              className="h-16 w-16 rounded-full bg-black/50 backdrop-blur flex items-center justify-center pointer-events-auto transition-opacity duration-300"
            >
              <Play size={34} className="text-white" />
            </button>
          )}

          {showMuteBtn && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white pointer-events-auto"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          )}
        </div>

        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/25">
            <div ref={progressRef} className="h-full w-0 bg-white" />
          </div>
        )}
      </div>
    );
  },
);

MediaPlayer.displayName = "MediaPlayer";

export default MediaPlayer;
