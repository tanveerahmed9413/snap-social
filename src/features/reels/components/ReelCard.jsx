import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Volume2,
} from "lucide-react";
import { useState, useRef } from "react";
import MediaPlayer from "../../../components/MediaPlayer";
import useVideoVisibility from "../../../shared/hooks/useVideoVisibility";
import { usePost } from "../../posts/hooks/usePost";
import { useReels } from "../hooks/useReels";

const ReelCard = ({ reel }) => {
  const { handleToggleLike, loading,} = usePost();
  const {reelsMuted,setReelsMuted} = useReels()
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useVideoVisibility(containerRef, playerRef);

  return (
    <article
      ref={containerRef}
      className="relative w-full max-w-md mx-auto snap-start overflow-hidden bg-black h-[calc(100dvh-64px)] lg:h-[100dvh]"
    >
      {/* Video */}
      <MediaPlayer
        ref={playerRef}
        src={reel.media_url}
        autoPlay
        // defaultMuted={false}
        showPlayBtn
        showMuteBtn
        muted={reelsMuted}
        onMuteToggle={setReelsMuted}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient */}
      <div className="absolute pointer-events-none inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/60 z-10" />

      {/* Top User */}
      <div className="absolute bottom-20 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={reel.profiles.avatar_url}
            alt={"user photo"}
            className="w-10 h-10 rounded-full object-cover border border-white"
          />
          <span className="text-white font-semibold text-sm">
            @{reel.profiles.username}
          </span>
        </div>

        <button>
          <MoreHorizontal className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Caption */}
      <div className="absolute left-4 bottom-8 right-20 z-20">
        <p className="text-white text-sm leading-5 line-clamp-2">
          {reel.caption}
        </p>
      </div>

      {/* Mute Button (UI Only) */}
      {/* <button onClick={isMuted}
       className="absolute bottom-32 left-50 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 transition">
        <Volume2 className="w-5 h-5" />
      </button> */}

      {/* Actions */}
      <div className="absolute right-4 bottom-30 z-20 flex flex-col items-center gap-5 text-white">
        <button className="flex flex-col items-center" >
          <Heart
            className={`w-7 h-7 transition `}
          />
          <span className="text-xs mt-1">{0}</span>
        </button>

        <button className="flex flex-col items-center">
          <MessageCircle className="w-7 h-7" />
          <span className="text-xs mt-1">{0}</span>
        </button>

        <button className="flex flex-col items-center">
          <Send className="w-7 h-7" />
        </button>

        <button className="flex flex-col items-center">
          {/* <Bookmark
            className={`w-7 h-7 transition ${
              saved ? "fill-yellow-400 text-yellow-400" : "text-white"
            }`}
          /> */}
        </button>
      </div>
    </article>
  );
};

export default ReelCard;
