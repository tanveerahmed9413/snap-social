// src/pages/ReelsPage.jsx
import { useEffect } from "react";
import ReelCard from "../components/ReelCard";
import { useReels } from "../hooks/useReels";

const ReelsPage = () => {
  const { reels,loading,handleGetReels } = useReels();

  useEffect(()=>{
    handleGetReels()
  },[])


  if(loading){
    return <h1>Loading....</h1>
  }
  return (
    <main className="h-[100dvh] w-full bg-zinc-200 flex justify-center items-center overflow-hidden">
      <div className="h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-none pb-16">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </main>
  );
};

export default ReelsPage;
