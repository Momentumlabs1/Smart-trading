import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei/core/RoundedBox';
import { CanvasTexture, Group, MathUtils, SRGBColorSpace } from 'three';

// The artwork is a deliberately fictional signal, drawn locally at retina resolution.
function makeSignalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 870;
  const c = canvas.getContext('2d')!;
  const background = c.createLinearGradient(0, 0, 1400, 870);
  background.addColorStop(0, '#303332');
  background.addColorStop(1, '#131615');
  c.fillStyle = background;
  c.fillRect(0, 0, 1400, 870);
  const text = (value: string, x: number, y: number, size: number, color: string, weight = 500) => {
    c.font = `${weight} ${size}px Manrope, sans-serif`;
    c.fillStyle = color;
    c.fillText(value, x, y);
  };
  text('SAIF', 70, 102, 42, '#f5f5ef', 800);
  text('SMART TRADING', 188, 99, 18, '#b3b7b2', 600);
  c.fillStyle = '#45483c';
  c.beginPath(); c.roundRect(1110, 60, 218, 54, 27); c.fill();
  text('BEISPIEL', 1157, 95, 20, '#e9e8be', 700);
  text('Ein Signal. Ein Plan.', 70, 198, 45, '#f5f5ef', 650);
  text('Einstieg, Risiko und Ziel auf einen Blick.', 70, 240, 23, '#a1a6a1');
  c.strokeStyle = '#ffffff0d'; c.lineWidth = 1.3;
  for (let y = 320; y <= 640; y += 80) { c.beginPath(); c.moveTo(70, y); c.lineTo(1320, y); c.stroke(); }
  for (let x = 70; x <= 1320; x += 100) { c.beginPath(); c.moveTo(x, 300); c.lineTo(x, 656); c.stroke(); }
  const candles = [[527,550],[548,503],[500,523],[520,478],[479,456],[455,491],[489,465],[465,410],[414,439],[438,398],[397,369],[371,402],[400,380],[378,333],[334,364],[363,348],[350,310],[310,331]];
  candles.forEach(([open, close], i) => {
    const x = 91 + i * 52;
    c.fillStyle = close < open ? '#f5d451' : '#757d73';
    c.fillRect(x + 11, Math.min(open, close) - 18, 2.5, Math.abs(open-close) + 38);
    c.beginPath(); c.roundRect(x, Math.min(open, close), 25, Math.max(8, Math.abs(open-close)), 3); c.fill();
  });
  [[335, 'ZIEL', '#d7dcba'], [467, 'EINSTIEG', '#f5d451'], [596, 'STOP LOSS', '#ae9c94']].forEach(([y, label, color]) => {
    c.strokeStyle = color as string; c.globalAlpha = .42; c.setLineDash([8, 9]);
    c.beginPath(); c.moveTo(75, +y); c.lineTo(1130, +y); c.stroke();
    c.setLineDash([]); c.globalAlpha = 1;
    text(label as string, 1153, +y + 7, 20, color as string, 700);
  });
  c.strokeStyle = '#ffffff24'; c.beginPath(); c.moveTo(70, 706); c.lineTo(1320, 706); c.stroke();
  ['01  EINSTIEG', '02  ABSICHERUNG', '03  ZIEL'].forEach((s, i) => {
    text(s, 70 + i * 442, 769, 19, '#989f97', 600);
    text(['Bewusst starten', 'Risiko definieren', 'Plan verfolgen'][i], 70 + i * 442, 819, 27, '#f5f5ef', 600);
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Cards({ moving }: { moving: boolean }) {
  const group = useRef<Group>(null);
  const texture = useMemo(makeSignalTexture, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(({ pointer, clock }, delta) => {
    if (!group.current || !moving) return;
    const t = clock.elapsedTime;
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, .12 - pointer.y * .10, 3, delta);
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, -.24 + pointer.x * .16, 3, delta);
    group.current.position.y = Math.sin(t * .65) * .045;
  });
  return (
    <group ref={group} rotation={[.12, -.24, -.10]}>
      <group position={[.05, .55, -.32]} rotation={[0, 0, .12]}>
        <RoundedBox args={[5.4, 3.55, .10]} radius={.17} smoothness={5}>
          <meshStandardMaterial color="#ead67b" metalness={.48} roughness={.3} />
        </RoundedBox>
      </group>
      <group position={[0, -.05, .02]}>
        <RoundedBox args={[5.55, 3.55, .14]} radius={.17} smoothness={5}>
          <meshStandardMaterial color="#343935" metalness={.66} roughness={.29} />
        </RoundedBox>
        <mesh position={[0, 0, .075]}>
          <planeGeometry args={[5.29, 3.29]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export default function HeroScene({ active }: { active: boolean }) {
  return (
    <Canvas camera={{ position: [0, .1, 8.9], fov: 38 }} dpr={[1, 1.5]} frameloop={active ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} aria-hidden="true">
      <ambientLight intensity={1.9} />
      <directionalLight position={[-3, 5, 6]} intensity={4} color="#ffffff" />
      <directionalLight position={[5, -1, 3]} intensity={2} color="#e7d792" />
      <Cards moving={active} />
    </Canvas>
  );
}
