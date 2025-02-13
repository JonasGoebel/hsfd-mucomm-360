import { createContext, useContext, useEffect, useRef } from "react";

const VideoContext = createContext(null);

export const VideoProvider = ({ children }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // create empty video element
    if (!videoRef.current) {
      const vid = document.createElement("video");
      videoRef.current = vid;
    }
  }, []);

  return (
    <VideoContext.Provider value={videoRef}>
      {children}
    </VideoContext.Provider>
  );
};

// create custom hook to access video
export const useVideo = () => useContext(VideoContext);
