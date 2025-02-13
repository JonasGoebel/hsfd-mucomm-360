import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useVideo } from "../providers/VideoProvider";
import VideoSphere from "../helpers/VideoSphere";

const FrontViewComponent = () => {
  const [texture, setTexture] = useState(null);

  const videoRef = useVideo();
  
  useEffect(() => {
    if(!videoRef.current) return

    const vidTexture = new THREE.VideoTexture(videoRef.current);
    vidTexture.colorSpace = THREE.SRGBColorSpace;
    setTexture(vidTexture);
  }, [videoRef]);

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.25,
        far: 10,
        position: [0, 0.5, 0],
        rotation: [0, -Math.PI / 2, 0]
      }}
    >
      <React.Suspense fallback={null}>
        <VideoSphere texture={texture} />
      </React.Suspense>

      {/* light and helper objects */}
      <ambientLight intensity={Math.PI / 2} />
      <mesh position={[0.75, -0.5, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial color={"green"} />
      </mesh>
    </Canvas>
  )
}

export default FrontViewComponent