import { useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei/core/RoundedBox';
import { Group, MathUtils } from 'three';

const candles = [
  [-2.9, .85, .5, false], [-2.15, 1.6, .1, true], [-1.4, 1.15, -.3, false],
  [-.65, 2.45, -.7, true], [.1, 1.8, -1.1, false], [.85, 3.2, -1.5, true],
  [1.6, 2.6, -1.9, false], [2.35, 4.1, -2.3, true],
] as const;

function Sculpture({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  const group = useRef<Group>(null);
  useFrame(({ pointer }, delta) => {
    if (!group.current || !active) return;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, -.18 + progress.current * .32 + pointer.x * .055, 3, delta);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, .08 + pointer.y * .025, 3, delta);
    group.current.position.y = MathUtils.damp(group.current.position.y, -.8 + progress.current * .12, 3, delta);
  });
  return <group ref={group} position={[0, -.8, 0]} rotation={[.08, -.18, 0]}>
    {candles.map(([x,height,z,gold],i) => <group key={i} position={[x, height/2 + i*.11, z]}>
      <RoundedBox args={[.46, height, .46]} radius={.045} smoothness={3}>
        <meshStandardMaterial color={gold ? '#e9c348' : '#626b7a'} roughness={gold ? .23 : .32} metalness={.78} />
      </RoundedBox>
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[.025,.025,height + .9,12]} /><meshStandardMaterial color={gold ? '#f8d886' : '#a0a6a8'} metalness={.9} roughness={.2} /></mesh>
    </group>)}
    <group position={[0,-.7,-.8]} rotation={[-Math.PI/2,0,0]}>
      {[1.9,2.9,3.9].map(radius => <mesh key={radius}><torusGeometry args={[radius,.012,5,90]} /><meshBasicMaterial color="#726344" transparent opacity={.34} /></mesh>)}
    </group>
    <mesh position={[0,-.83,-1]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[3.95,90]} /><meshStandardMaterial color="#181a1e" metalness={.7} roughness={.42} /></mesh>
  </group>;
}

export default function MarketSculpture({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  return <Canvas camera={{ position:[5,4.3,12.5], fov:42 }} onCreated={({camera})=>camera.lookAt(0,1,-.7)} dpr={[1,1.25]} frameloop={active ? 'always' : 'demand'} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} aria-hidden="true">
    <ambientLight intensity={1.15}/><directionalLight position={[-4,7,4]} intensity={3.5} color="#fff4df"/><directionalLight position={[5,3,-3]} intensity={3} color="#ffffff"/><pointLight position={[-3,-1,5]} intensity={16} color="#ecd267"/>
    <Sculpture progress={progress} active={active}/>
  </Canvas>;
}
