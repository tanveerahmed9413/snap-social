import { useContext } from "react";
import { getAllReels } from "../services/reels.api";
import { ReelsContext } from "../reel.context";

export function useReels() {
  const { loading, setLoading, reels, setReels } = useContext(ReelsContext);
  const handleGetReels = async () => {
    try {
      setLoading(true);
      const allReels = await getAllReels();
      setReels(allReels);
      return allReels;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    reels,
    loading,
    handleGetReels,
  };
}
