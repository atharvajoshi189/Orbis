"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// --- Custom Shader Material ---
const AuroraMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color("#000000"),
        uColorEnd: new THREE.Color("#0ea5e9"), // Orbis Primary (Sky Blue)
        uColorCore: new THREE.Color("#7c3aed"), // Purple accent
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    uniform vec3 uColorCore;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      // Create a wave pattern
      float wave = snoise(vec2(uv.x * 3.0, uv.y * 3.0 + uTime * 0.8));
      float wave2 = snoise(vec2(uv.x * 6.0 - uTime * 0.4, uv.y * 4.0));
      
      float strength = (wave + wave2) * 0.5;
      
      // Horizon glow effect
      float horizon = 1.0 - abs(uv.y - 0.5) * 2.0;
      horizon = pow(horizon, 3.0);
      
      // Combine
      vec3 color = mix(uColorStart, uColorEnd, horizon * 0.8 + strength * 0.2);
      
      // Add a hot core in the middle
      float core = 1.0 - length(uv - 0.5) * 2.0;
      core = max(0.0, core);
      core = pow(core, 2.0);
      color += uColorCore * core * 0.3 * (1.0 + sin(uTime * 2.0));

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ AuroraMaterial });

import { useAppStore } from "@/lib/store";

function AuroraPlane() {
    const materialRef = useRef<any>(null);
    const { theme } = useAppStore();

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uTime = clock.getElapsedTime();
        }
    });

    const colors = useMemo(() => {
        return theme === 'dark'
            ? {
                start: new THREE.Color("#000000"),
                end: new THREE.Color("#0ea5e9"),
                core: new THREE.Color("#7c3aed")
            }
            : {
                start: new THREE.Color("#ffffff"),
                end: new THREE.Color("#84cc16"), // Lime Green
                core: new THREE.Color("#a855f7") // Lighter Purple
            }
    }, [theme]);

    return (
        <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, -2, -10]} scale={[30, 20, 1]}>
            <planeGeometry args={[1, 1, 64, 64]} />
            {/* @ts-ignore */}
            <auroraMaterial
                ref={materialRef}
                transparent
                opacity={0.8}
                uColorStart={colors.start}
                uColorEnd={colors.end}
                uColorCore={colors.core}
            />
        </mesh>
    );
}

export default function AuroraBackground3D() {
    return (
        <div className="fixed inset-0 -z-30 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                {/* <ambientLight intensity={0.5} /> */}
                <AuroraPlane />
            </Canvas>
        </div>
    );
}
