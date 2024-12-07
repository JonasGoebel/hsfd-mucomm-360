import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import panoVideo from './assets/Netlab1.mp4'

const VideoSphere = () => {
  const [texture, setTexture] = useState(null);
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = panoVideo;
    vid.crossOrigin = "anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    return vid;
  });

  useEffect(() => {
    video.play();
    const vidTexture = new THREE.VideoTexture(video);
    vidTexture.colorSpace = THREE.SRGBColorSpace;
    setTexture(vidTexture);
  }, [video]);

  return (
    texture && (
      <mesh>
        <sphereGeometry args={[5, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    )
  );
};

const App = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{
          fov: 75,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.25,
          far: 10,
          position: [0, 0, 0.5],
        }}
      >
        <React.Suspense fallback={null}>
          <VideoSphere />
        </React.Suspense>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={-Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default App;
