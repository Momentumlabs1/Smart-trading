import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei/core/RoundedBox';
import { BufferGeometry, DirectionalLight, DoubleSide, Float32BufferAttribute, Group, MathUtils, PMREMGenerator, Shape, Vector2 } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function StudioLight() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, .04);
    scene.environment = target.texture;
    return () => { scene.environment = null; target.dispose(); generator.dispose(); room.dispose(); };
  }, [gl, scene]);
  return null;
}
function PaperPlane() {
  const wing = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([
      1.8,1.55,0, -2,.15,0, -.42,-.23,.36,
      1.8,1.55,0, -.42,-.23,.36, .35,-1.6,0,
      -.42,-.23,.36, -.8,-1.2,-.05, .35,-1.6,0,
    ], 3));
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => wing.dispose(), [wing]);
  const silhouette = useMemo(() => new Shape([[1.8,1.55],[-2,.15],[-.65,-.35],[-.8,-1.2],[.35,-1.6]].map(([x,y])=>new Vector2(x,y))), []);
  return <group rotation={[-.1,-.3,-.1]}>
    <mesh position={[0,0,-.08]}><extrudeGeometry args={[silhouette,{depth:.09,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.03,bevelThickness:.03}]}/><meshStandardMaterial color="#e5b817" metalness={.85} roughness={.2}/></mesh>
    <mesh geometry={wing}><meshStandardMaterial color="#ffda38" metalness={.7} roughness={.24} side={DoubleSide}/></mesh>
  </group>;
}
function Pointer() {
  const shape = useMemo(() => { const s = new Shape(); s.moveTo(-1.15,1.8); s.lineTo(-1.15,-1.15); s.lineTo(-.3,-.55); s.lineTo(.45,-1.8); s.lineTo(1.13,-1.38); s.lineTo(.4,-.12); s.lineTo(1.35,.05); s.closePath(); return s; }, []);
  return <group rotation={[.05,-.35,.17]}>
    <mesh><extrudeGeometry args={[shape,{depth:.38,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.08,bevelThickness:.06}]}/><meshStandardMaterial color="#e4eaf4" metalness={.9} roughness={.16}/></mesh>
    {[.62,.9].map(r=><mesh key={r} position={[-1.06,1.55,-.16]} rotation={[0,0,.5]}><torusGeometry args={[r,.014,8,72,Math.PI*.65]}/><meshStandardMaterial color="#ffdf35" metalness={.65} roughness={.25}/></mesh>)}
  </group>;
}
function Book({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  const cover = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!active || !cover.current) return;
    const opening = MathUtils.smoothstep(progress.current, 1.4, 2);
    cover.current.rotation.y = MathUtils.damp(cover.current.rotation.y, -.1 - opening * .48, 4, Math.min(delta, .05));
  });
  return <group rotation={[.13,-.42,-.09]}>
    <RoundedBox args={[2.32,3.08,.13]} radius={.07} position={[0,0,-.24]}><meshStandardMaterial color="#1d2027" metalness={.45} roughness={.32}/></RoundedBox>
    <RoundedBox args={[2.17,2.89,.34]} radius={.045} position={[.04,0,0]}><meshStandardMaterial color="#ede9df" metalness={.05} roughness={.8}/></RoundedBox>
    {[0,1,2,3,4].map(i=><mesh key={i} position={[1.126,0,-.12+i*.06]}><boxGeometry args={[.006,2.82,.009]}/><meshStandardMaterial color="#9da9bb" roughness={.8}/></mesh>)}
    <group ref={cover} position={[-1.12,0,.2]} rotation={[0,-.1,0]}>
      <RoundedBox args={[2.34,3.08,.14]} radius={.07} position={[1.12,0,0]}><meshStandardMaterial color="#333842" metalness={.65} roughness={.31}/></RoundedBox>
      <mesh position={[1.28,.12,.11]} rotation={[0,0,-.38]}><boxGeometry args={[.2,1.6,.07]}/><meshStandardMaterial color="#ffe14a" metalness={.7} roughness={.2}/></mesh>
      <mesh position={[1.1,-1.07,.1]}><boxGeometry args={[1.35,.015,.01]}/><meshStandardMaterial color="#8c9eba" metalness={.7} roughness={.3}/></mesh>
    </group>
  </group>;
}
function Objects({ progress, active }: { progress: MutableRefObject<number>; active: boolean }) {
  const groups = useRef<(Group | null)[]>([]);
  const displayed = useRef(progress.current);
  useFrame(({clock,pointer},delta) => {
    if (!active) return;
    displayed.current = MathUtils.damp(displayed.current,progress.current,7,Math.min(delta,.05));
    groups.current.forEach((group,i)=>{
      if (!group) return;
      const offset=i-displayed.current;
      const distance=Math.abs(offset);
      group.visible=distance<.85;
      group.position.x=offset*2.8;
      group.position.z=-distance*3;
      group.position.y=Math.sin(clock.elapsedTime*.65+i)*.1;
      group.rotation.y=-offset*1.7+pointer.x*.13+Math.sin(clock.elapsedTime*.33)*.1;
      group.rotation.x=pointer.y*-.08;
      group.rotation.z=-offset*.22;
      group.scale.setScalar(MathUtils.smoothstep(1-distance,.15,.85));
    });
  });
  return <>{[<PaperPlane/>,<Pointer/>,<Book progress={progress} active={active}/>].map((object,i)=><group key={i} ref={el=>{groups.current[i]=el;}} position={[i*6,0,0]}>{object}</group>)}</>;
}
function MovingLight({progress,active}:{progress:MutableRefObject<number>;active:boolean}) {
  const light=useRef<DirectionalLight>(null);
  useFrame(({pointer},delta)=>{
    if(!active||!light.current)return;
    const t=Math.min(delta,.05);
    light.current.position.x=MathUtils.damp(light.current.position.x,4-progress.current*3+pointer.x*1.5,3,t);
    light.current.intensity=MathUtils.damp(light.current.intensity,2.7+progress.current*.45,3,t);
  });
  return <directionalLight ref={light} position={[4,4,5]} intensity={2.7}/>;
}
export default function TradeObjects({progress,active}:{progress:MutableRefObject<number>;active:boolean}) {
  return <Canvas camera={{position:[0,0,7.8],fov:39}} dpr={[1,1.35]} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} frameloop={active?'always':'demand'} aria-hidden="true">
    <StudioLight/><MovingLight progress={progress} active={active}/><ambientLight intensity={.65}/><directionalLight position={[-5,0,2]} intensity={2.5} color="#e6edff"/><pointLight position={[0,-3,3]} intensity={12} color="#ffd931"/>
    <Objects progress={progress} active={active}/>
  </Canvas>;
}
