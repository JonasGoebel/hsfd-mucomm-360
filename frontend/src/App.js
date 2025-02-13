import React, { useState, useEffect } from "react";
import WebRtcConnection from "./WebRtcConnection.jsx";
import { VideoProvider } from "./providers/VideoProvider.js";
import ThreeSixtyViewComponent from './views/ThreeSixtyViewComponent.js'
import FrontViewComponent from './views/FrontViewComponent.js'
import BackViewComponent from './views/BackViewComponent.js'
import RawVideoComponent from "./views/RawVideoComponent.js";

import './App.css'

const NewDesignComponent = () => {
  // const [texture, setTexture] = useState(null);
  const [video, setVideo] = useState();
  const [isDemo, setIsDemo] = useState(false);
  const [shouldStartStream, setShouldStartStream] = useState(false)
    
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.get('demo') === 'true') setIsDemo(true)
  }, [])

  // useEffect(() => {
  //   if (!video) return;

  //   video.play();
  //   const vidTexture = new THREE.VideoTexture(video);
  //   vidTexture.colorSpace = THREE.SRGBColorSpace;
  //   setTexture(vidTexture);
  // }, [video]);

  return (
    <VideoProvider>
      <div className="container">
        <div className="navbar">
          <h2>360° Camera Stream</h2>
          <WebRtcConnection isDemo={isDemo} shouldStartStream={shouldStartStream} setVideo={setVideo} />

          {!shouldStartStream && <div className="button" onClick={() => setShouldStartStream(true)}>{isDemo ? 'Show Demo Video' : 'Connect to 360° Camera'}</div>}
          {shouldStartStream && <div className="button" onClick={() => setShouldStartStream(false)}>Stop</div>}
        </div>
        <div className="row">
          <div className="box">
            {<RawVideoComponent shouldStartStream={shouldStartStream} /> }
          </div>
          <div className="box">
            {shouldStartStream && <FrontViewComponent />}
          </div>
        </div>
        <div className="row">
          <div className="box">
            {shouldStartStream && <ThreeSixtyViewComponent /> }
          </div>
          <div className="box">
            {shouldStartStream && <BackViewComponent />}
          </div>
        </div>
      </div>
    </VideoProvider>
  )
}

export default NewDesignComponent