import React, { useEffect, useRef } from "react";
import { useVideo } from "../providers/VideoProvider";
import './RawVideoComponent.css'

const RawVideoComponent = ({shouldStartStream}) => {
  const videoRef = useVideo();
  const containerRef = useRef(null);

  useEffect(() => {
    if(!shouldStartStream && containerRef.current) {
      containerRef.current.replaceChildren(videoRef.current)
    }
  }, [shouldStartStream])

  useEffect(() => {
    if (containerRef.current && videoRef.current) {
      containerRef.current.appendChild(videoRef.current);
    }
  }, [videoRef]);

  return <div ref={containerRef} />;
}

export default RawVideoComponent
