import { createContext, useContext } from "react";

export const VideoContext = createContext<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
}>({
  loading: true,
  setLoading: () => {},
});
export const useVideoContext = () => useContext(VideoContext);
