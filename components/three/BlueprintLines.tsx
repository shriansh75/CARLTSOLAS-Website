"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMotionHold } from "@/components/providers/MotionHold";

/**
 * A slowly rotating 3D naval "lines plan" (stations + waterlines forming a hull
 * surface, thin steel wireframe with an accent deck line). The 3D cousin of the
 * loader's BlueprintHull, extending CARLTSOLAS's own blueprint identity. Imports
 * three/R3F directly, so it must only ever load through next/dynamic({ssr:false})
 * (TechCenterpiece does this). The R3F frame loop is the only engine on the group.
 */

const LENGTH = 30;
const N_STATIONS = 15;
const N_WATERLINES = 6;
const MAX_BEAM = 5.6;
const DRAFT = 3.4;
const MAX_DELTA = 0.05;
const STEEL = "#78b0f0";
const ACCENT = "#1d5bd8";

function halfBeam(u: number) {
  const t = 2 * u - 1;
  return MAX_BEAM * Math.sqrt(Math.max(0, 1 - t * t));
}
function sheer(u: number) {
  const t = 2 * u - 1;
  return 0.55 * t * t; // deck edge rises toward bow and stern
}
function pt(u: number, v: number, side: number): [number, number, number] {
  const ang = (v * Math.PI) / 2;
  const x = (u - 0.5) * LENGTH;
  const z = side * halfBeam(u) * Math.sin(ang);
  const y = -DRAFT * Math.cos(ang) + sheer(u) * v;
  return [x, y, z];
}

function buildGeometry() {
  const hull: number[] = [];
  const accent: number[] = [];
  const stationsU = Array.from({ length: N_STATIONS }, (_, i) => i / (N_STATIONS - 1));
  const uFine = Array.from({ length: 60 }, (_, i) => i / 59);

  // station curves (transverse sections), both sides
  for (const u of stationsU) {
    for (const side of [1, -1]) {
      let prev = pt(u, 0, side);
      for (let k = 1; k <= 16; k++) {
        const cur = pt(u, k / 16, side);
        hull.push(...prev, ...cur);
        prev = cur;
      }
    }
  }

  // waterlines (longitudinal), both sides; the deck edge (v = 1) is the accent line
  for (let j = 1; j <= N_WATERLINES; j++) {
    const v = j / N_WATERLINES;
    const target = j === N_WATERLINES ? accent : hull;
    for (const side of [1, -1]) {
      let prev = pt(uFine[0], v, side);
      for (let k = 1; k < uFine.length; k++) {
        const cur = pt(uFine[k], v, side);
        target.push(...prev, ...cur);
        prev = cur;
      }
    }
  }

  // keel line
  let prevKeel = pt(uFine[0], 0, 1);
  for (let k = 1; k < uFine.length; k++) {
    const cur = pt(uFine[k], 0, 1);
    hull.push(...prevKeel, ...cur);
    prevKeel = cur;
  }

  return { hull: new Float32Array(hull), accent: new Float32Array(accent) };
}

function HullLines({ paused, pointer }: { paused: boolean; pointer: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { hull, accent } = useMemo(buildGeometry, []);

  const hullGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(hull, 3));
    return g;
  }, [hull]);
  const accentGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(accent, 3));
    return g;
  }, [accent]);
  const hullMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(STEEL), transparent: true, opacity: 0.34 }),
    [],
  );
  const accentMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(ACCENT), transparent: true, opacity: 0.7 }),
    [],
  );

  useEffect(
    () => () => {
      hullGeo.dispose();
      accentGeo.dispose();
      hullMat.dispose();
      accentMat.dispose();
    },
    [hullGeo, accentGeo, hullMat, accentMat],
  );

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (paused || !g) return;
    const d = Math.min(delta, MAX_DELTA);
    g.rotation.y += d * 0.12; // slow auto-orbit
    const p = pointer.current ?? { x: 0, y: 0 };
    const ease = 1 - Math.exp(-d * 2.5);
    g.rotation.x += (-0.32 + p.y * 0.22 - g.rotation.x) * ease; // parallax tilt
    g.rotation.z += (p.x * 0.06 - g.rotation.z) * ease;
  });

  return (
    <group ref={groupRef} rotation={[-0.32, 0.5, 0]}>
      <lineSegments geometry={hullGeo} material={hullMat} frustumCulled={false} />
      <lineSegments geometry={accentGeo} material={accentMat} frustumCulled={false} />
    </group>
  );
}

export function BlueprintLines() {
  const { held } = useMotionHold();
  const [docHidden, setDocHidden] = useState(false);
  const [inView, setInView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const update = () => setDocHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "160px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onMove = (e: globalThis.PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [inView]);

  const active = inView && !held && !docHidden;

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "low-power", alpha: true }}
        camera={{ position: [0, 3, 34], fov: 42, near: 0.1, far: 120 }}
        frameloop={active ? "always" : "never"}
        fallback={null}
      >
        <HullLines paused={!active} pointer={pointer} />
      </Canvas>
    </div>
  );
}
