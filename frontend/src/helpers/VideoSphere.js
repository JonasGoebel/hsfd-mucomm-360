import * as THREE from "three";

const VideoSphere = ({ texture }) => {
  return (
    texture && (
      <mesh>
        <sphereGeometry args={[5, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    )
  );
};

export default VideoSphere
